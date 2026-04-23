import pretix from '../config/pretix.js'
import participatorModel from '../models/participator.model.js';
import participatorQuestionModel from '../models/participatorQuestion.model.js';
import settingModel from '../models/setting.model.js';
import { sendMailToParents } from './mail.controller.js';
import preferenceModel from '../models/preference.model.js';
import BaseController from './base.controller.js'
import { isLTOrHasPermission } from '../middleware/auth.js'

let questionMapperPromise = null;
function getQuestionMapper() {
	if (!questionMapperPromise) questionMapperPromise = getPretixMapper();
	return questionMapperPromise;
}

class ParticipatorController extends BaseController {
	constructor() {
		super({ model: participatorModel, paramKey: ['orderId', 'positionId'] })
	}

	findOne() {
		return async (req, res) => {
			if (res && !await isLTOrHasPermission(req, 'participator')) {
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
	}

	findAll() {
		return async (req, res) => {
			if (!await isLTOrHasPermission(req, 'participator')) {
				res.status(403).send('Not allowed');
				return;
			}
			const participatorAnswers = await findAllParticipators();
			res.json(participatorAnswers);
		}
	}

	createOrUpdate() {
		return async (req, res) => {
			if (!await isLTOrHasPermission(req, 'participator')) {
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
					case 1: sendMail = 'participatorConfirmation'; break;
					case 3: sendMail = 'participatorQueued'; break;
					default: break;
				}
				if (sendMail) {
					await sendMailToParents(req.params.orderId, req.params.positionId, sendMail);
				}
			}
			res.status(200).send();
		}
	}
}

export default new ParticipatorController()

// Standalone — wird intern aufgerufen (group.controller.js, mail.controller.js)

export async function findOne(req) {
	const participatorAnswers = await getOneParticipatorAnswers(req.params.orderId, req.params.positionId);
	const participator = (await participatorModel.findOne({
		where: {
			orderId: req.params.orderId,
			positionId: req.params.positionId
		}
	}))?.dataValues;
	return {...participator, ...participatorAnswers};
}

export async function findAllParticipators() {
	const participatorAnswers = await getAllParticipatorsAnswers();
	const participators = await participatorModel.findAll();
	for (const [key, value] of Object.entries(participatorAnswers)) {
		let participator = participators.find((p) => p.orderId === value.orderId && p.positionId === value.positionId);
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

function mapPositionInfo(position, questionMapper) {
	let answers = {};
	position.answers.map((answer) => {
		answers[questionMapper[answer.question_identifier] || answer.question_identifier] = answer.answer;
	});
	return answers;
}

async function getOneParticipatorAnswers(orderId, positionId) {
	const questionMapper = await getQuestionMapper();
	const order = await fetch(pretix.apiUrl + '/organizers/' + pretix.organizer + '/events/' + pretix.event + '/orders/' + orderId, {
		method: 'GET',
		headers: { 'Authorization': `Token ${pretix.apiToken}` }
	})
	.then(response => {
		if (!response.ok) throw new Error('Network response was not ok');
		return response.json();
	})
	.catch((error) => { console.error('Error:', error); });
	let position = order.positions[positionId - 1];
	return {
		...mapOrderInfo(order),
		...mapPositionInfo(position, questionMapper),
		...{week: (position.item == pretix.teensWeek) ? 'teens' : (position.item == pretix.kidsWeek) ? 'kids' : '',}
	};
}

async function getAllParticipatorsAnswers(page = 1, summarized = {}) {
	const questionMapper = await getQuestionMapper();
	const orders = await fetch(pretix.apiUrl + '/organizers/' + pretix.organizer + '/events/' + pretix.event + '/orders/?page=' + page, {
		method: 'GET',
		headers: { 'Authorization': `Token ${pretix.apiToken}` }
	})
	.then(response => {
		if (!response.ok) throw new Error('Network response was not ok');
		return response.json();
	})
	.catch((error) => { console.error('Error:', error); });

	let participators = {};
	for (let order of orders.results) {
		for (let position of order.positions) {
			if (position.answers && position.answers.length > 0) {
				participators[position.id] = {
					...mapOrderInfo(order),
					...mapPositionInfo(position, questionMapper),
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
