import pretix from '../config/pretix.js'
import participatorModel from '../models/participator.model.js';
import participatorQuestionModel from '../models/participatorQuestion.model.js';
import userPermissionModel from '../models/userPermission.model.js';
import settingModel from '../models/setting.model.js';
import { sendMailToParents } from './mail.controller.js';
import preferenceModel from '../models/preference.model.js';

const questionMapper = await getPretixMapper();
async function isAllowed(req) {
	const executingUser = req.kauth.grant.access_token.content.sub
	const isLT = req.kauth.grant.access_token.content.groups?.includes('Leitungsteam')
	const allowed = isLT || (await userPermissionModel.findOne({where: { uuid: executingUser, permission: 'participator'}}))?.allowed
	return allowed
}


export async function findOne(req, res) {
	if (res && !await isAllowed(req)) {
		res.status(403).send('Not allowed');
		return;
	}
	const participatorAnswers = await getOneParticipatorAnswers(req.params.orderId, req.params.positionId);
	const participator = (await participatorModel.findOne({
		where: {
			orderId: req.params.orderId,
			positionId: req.params.positionId
		}
	}))?.dataValues;
	if (res) res.status(200).send({...participator, ...participatorAnswers});
	else return {...participator, ...participatorAnswers};
}

export async function findAll(req, res) {
	if (!await isAllowed(req)) {
		res.status(403).send('Not allowed');
		return;
	}
	const participatorAnswers = await findAllParticipators();
	res.json(participatorAnswers);
}

export async function findAllParticipators() {
	const participatorAnswers = await getAllParticipatorsAnswers();
	const participators = await participatorModel.findAll();
	for (const [key, value] of Object.entries(participatorAnswers)) {
		let participator = participators.find((participator) => participator.orderId === value.orderId && participator.positionId === value.positionId);
		const preference = await preferenceModel.findByPk(participator?.preferenceId);
		participatorAnswers[key] = {...{
			preferenceId: participator?.preferenceId,
			groupId: preference?.groupId,
			status: value.paymentStatus === 'c' ? 2 : (participator?.status || 0),
			ignoredWishes: participator?.ignoredWishes
		}, ...value};
	}
	return participatorAnswers;
}

export async function createOrUpdate(req, res) {
	if (!await isAllowed(req)) {
		res.status(403).send('Not allowed');
		return;
	}
	const participator = await participatorModel.findOne({
		where: {
			orderId: req.params.orderId,
			positionId: req.params.positionId
		}
	});
	/**
	 * 0: not confirmed
	 * 1: confirmed
	 * 2: cancelled
	 * 3: waiting list
	 */
	let currentStatus = 0;
	if (participator) {
		currentStatus = participator.status;
		await participator.update(req.body);
	} else {
		await participatorModel.create({
			orderId: req.params.orderId,
			positionId: req.params.positionId,
			...req.body
		});
	}
	if (req.body.status !== currentStatus) {
		let sendMail = false;
		switch (req.body.status) {
			case 1:
				sendMail = 'participatorConfirmation'
				break;
			case 3:
				sendMail = 'participatorQueued'
				break;
			default:
				break;
		}
		if (sendMail) {
			await sendMailToParents(req.params.orderId, req.params.positionId, sendMail);
		}
	}
	res.status(200).send();
}

async function getPretixMapper() {
	const questions = await participatorQuestionModel.findAll();
	let mapper = {};
	for (let question of questions) {
		if (question.referId) mapper[question.referId] = question.id;
	}
	return mapper;
}

function mapOrderInfo(order) {
	return {
		parentFirstName: order.invoice_address.name_parts.given_name,
		parentLastName: order.invoice_address.name_parts.family_name,
		street: order.invoice_address.street,
		zipCode: order.invoice_address.zipcode,
		city: order.invoice_address.city,
		addressExtra: order.invoice_address.custom_field,
		phone: order.phone,
		parentMail: order.email,
		paymentStatus: order.status,
		paymentProvider: order.payment_provider,
		bookedAt: order.datetime,
	};
}

function mapPositionInfo(position) {
	let answers = {};
	position.answers.map((answer) => {
		answers[questionMapper[answer.question_identifier] || answer.question_identifier] = answer.answer;
	});
	return answers;
}

async function getOneParticipatorAnswers(orderId, positionId) {
	const order = await fetch(pretix.apiUrl + '/organizers/' + pretix.organizer + '/events/' + pretix.event + '/orders/' + orderId, {
		method: 'GET',
		headers: {
			'Authorization': `Token ${pretix.apiToken}`
		}
	})
	.then(response => {
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		return response.json();
	 })
	.catch((error) => {
		console.error('Error:', error);
	});
	let position = order.positions[positionId - 1];
	return {
		...mapOrderInfo(order),
		...mapPositionInfo(position),
		...{week: (position.item == pretix.teensWeek) ? 'teens' : (position.item == pretix.kidsWeek) ? 'kids' : '',}
	};
}

async function getAllParticipatorsAnswers(page = 1, summarized = {}) {
	const orders = await fetch(pretix.apiUrl + '/organizers/' + pretix.organizer + '/events/' + pretix.event + '/orders/?page=' + page, {
		method: 'GET',
		headers: {
			'Authorization': `Token ${pretix.apiToken}`
		}
	})
	.then(response => {
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		return response.json();
	 })
	.catch((error) => {
		console.error('Error:', error);
	});

	let participators = {};
	for (let order of orders.results) {
		for (let position of order.positions) {
			if (position.answers && position.answers.length > 0) {
				participators[position.id] = {
					...mapOrderInfo(order),
					...mapPositionInfo(position),
					...{
						orderId: order.code,
						positionId: position.positionid,
						week: (position.item == pretix.teensWeek) ? 'teens' : (position.item == pretix.kidsWeek) ? 'kids' : '',
					},
				};
			}
		}
	}
	if (orders.next) {
		return await getAllParticipatorsAnswers(page + 1, {...summarized, ...participators});
	}
	return {...summarized, ...participators};
}