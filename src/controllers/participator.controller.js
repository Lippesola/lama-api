import pretix from '../config/pretix.js'
import participatorModel from '../models/participator.model.js';
import participatorQuestionModel from '../models/participatorQuestion.model.js';
import settingModel from '../models/setting.model.js';
import { sendMailToParents } from './mail.controller.js';
import preferenceModel from '../models/preference.model.js';
import BaseController from './base.controller.js'
import { isLTOrHasPermission } from '../middleware/auth.js'
import { getPretixOrder, getPretixOrdersPage, getPretixQuestions, patchPretixOrder, patchPretixOrderPosition } from '../utils/pretix.js'

let questionMapperPromise = null;
function getQuestionMapper() {
	if (!questionMapperPromise) questionMapperPromise = getPretixMapper();
	return questionMapperPromise;
}

const ORDER_ADDRESS_FIELDS = {
	parentFirstName: (addr, value) => { addr.name_parts = { ...addr.name_parts, given_name: value }; },
	parentLastName: (addr, value) => { addr.name_parts = { ...addr.name_parts, family_name: value }; },
	street: (addr, value) => { addr.street = value; },
	zipCode: (addr, value) => { addr.zipcode = value; },
	city: (addr, value) => { addr.city = value; },
	addressExtra: (addr, value) => { addr.custom_field = value; },
};
const ORDER_TOP_LEVEL_FIELDS = {
	phone: 'phone',
	parentMail: 'email',
};

const NON_PRETIX_FIELDS = new Set([
	'orderId', 'positionId', 'week', 'paymentStatus', 'paymentProvider', 'bookedAt',
	'status', 'groupId', 'preferenceId', 'ignoredWishes',
]);

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

	updateDetails() {
		return async (req, res) => {
			if (!await isLTOrHasPermission(req, 'participator')) {
				res.status(403).send('Not allowed');
				return;
			}
			const { orderId, positionId } = req.params;
			try {
				const order = await getPretixOrder(orderId);
				const position = order?.positions?.[positionId - 1];
				if (!position) {
					res.status(404).send('not found');
					return;
				}

				const orderBody = {};
				// Nur die tatsächlich geänderten Adressfelder senden, nicht die komplette von Pretix
				// gelieferte invoice_address kopieren - die enthält auch Nur-Lese-/Nebenfelder
				// (z.B. `name`, `transmission_info`), die beim PATCH Validierungsfehler auslösen.
				const addressChanges = {};
				let addressChanged = false;
				const answerChanges = {};

				for (const [key, value] of Object.entries(req.body || {})) {
					if (NON_PRETIX_FIELDS.has(key)) continue;
					if (ORDER_ADDRESS_FIELDS[key]) {
						ORDER_ADDRESS_FIELDS[key](addressChanges, value);
						addressChanged = true;
					} else if (ORDER_TOP_LEVEL_FIELDS[key]) {
						orderBody[ORDER_TOP_LEVEL_FIELDS[key]] = value;
					} else {
						answerChanges[key] = value;
					}
				}
				if (addressChanged) {
					// name_parts wird von Pretix beim PATCH komplett ersetzt, daher bestehende Werte als Basis nehmen.
					if (addressChanges.name_parts) {
						addressChanges.name_parts = { ...(order.invoice_address?.name_parts || {}), ...addressChanges.name_parts };
					}
					orderBody.invoice_address = addressChanges;
				}

				if (Object.keys(orderBody).length) {
					await patchPretixOrder(orderId, orderBody);
				}
				if (Object.keys(answerChanges).length) {
					const answersPayload = await buildAnswersPayload(position, answerChanges);
					await patchPretixOrderPosition(position.id, { answers: answersPayload });
				}

				const updated = await getOneParticipatorAnswers(orderId, positionId);
				const local = (await participatorModel.findOne({
					where: { orderId, positionId }
				}))?.dataValues;
				res.status(200).send({ ...local, ...updated });
			} catch (e) {
				console.error(e);
				res.status(502).send('Pretix update failed');
			}
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

async function buildAnswersPayload(position, changes) {
	const pretixQuestions = await getPretixQuestions();
	const questionMapper = await getQuestionMapper(); // referId -> interne id
	const referIdByInternalId = {};
	for (const [referId, internalId] of Object.entries(questionMapper)) {
		referIdByInternalId[internalId] = referId;
	}

	const answers = (position.answers || []).map((a) => ({ ...a }));

	// Choice-Antworten, die unverändert mitkopiert werden, liefern per GET kein verlässliches
	// options-Feld - Pretix verlangt es beim Schreiben aber für JEDE Choice-Antwort im Array.
	for (const a of answers) {
		const question = pretixQuestions.find((q) => q.id === a.question);
		if (question && (question.type === 'C' || question.type === 'M') && (!a.options || a.options.length === 0)) {
			a.options = resolveOptionIds(question, a);
		}
	}

	for (const [key, value] of Object.entries(changes)) {
		// key ist entweder eine interne ParticipatorQuestion-id oder bereits der rohe Pretix-identifier
		// (siehe mapPositionInfo: unbekannte Fragen werden unverändert durchgereicht).
		const identifier = referIdByInternalId[key] || key;
		const question = pretixQuestions.find((q) => q.identifier === identifier);
		if (!question) continue; // unbekanntes Feld, nicht nach Pretix schreibbar

		const existingIndex = answers.findIndex((a) => a.question === question.id);
		const isEmpty = value === null || value === undefined || value === '';

		if (isEmpty) {
			// Pretix akzeptiert keine leeren Antworten - unbeantwortete Fragen fehlen im Array,
			// statt mit einem leeren answer-Feld drinzustehen.
			if (existingIndex !== -1) answers.splice(existingIndex, 1);
			continue;
		}

		let optionIds;
		if (question.type === 'C' || question.type === 'M') {
			optionIds = resolveOptionIds(question, { answer: value });
		}

		if (existingIndex !== -1) {
			answers[existingIndex].answer = value;
			if (optionIds) answers[existingIndex].options = optionIds;
		} else {
			answers.push({ question: question.id, question_identifier: question.identifier, answer: value, options: optionIds || [] });
		}
	}
	return answers;
}

// Pretix liefert Options-Label als i18n-Objekt ({"de": "Ja"}), teils aber auch als reinen String.
function getOptionLabel(option) {
	if (typeof option.answer === 'string') return option.answer;
	if (option.answer && typeof option.answer === 'object') {
		return option.answer.de ?? Object.values(option.answer)[0];
	}
	return option.answer;
}

// Löst die gewählten Options-PKs einer Choice-Antwort auf: bevorzugt über option_identifiers,
// sonst über einen Label-Abgleich des answer-Textes gegen die Fragedefinition.
function resolveOptionIds(question, entry) {
	if (Array.isArray(entry.option_identifiers) && entry.option_identifiers.length) {
		return entry.option_identifiers
			.map((identifier) => (question.options || []).find((o) => o.identifier === identifier)?.id)
			.filter((id) => id !== undefined);
	}
	if (!entry.answer) return [];
	const values = question.type === 'M' ? String(entry.answer).split(',').map((v) => v.trim()) : [entry.answer];
	return (question.options || [])
		.filter((option) => values.includes(getOptionLabel(option)))
		.map((option) => option.id);
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
	const order = await getPretixOrder(orderId);
	let position = order.positions[positionId - 1];
	return {
		...mapOrderInfo(order),
		...mapPositionInfo(position, questionMapper),
		...{week: (position.item == pretix.teensWeek) ? 'teens' : (position.item == pretix.kidsWeek) ? 'kids' : '',}
	};
}

async function getAllParticipatorsAnswers(page = 1, summarized = {}) {
	const questionMapper = await getQuestionMapper();
	const orders = await getPretixOrdersPage(page);

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
