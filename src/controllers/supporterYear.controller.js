import kcAdminClient from "../config/keycloak-cli.js";
import supporterYearModel from '../models/supporterYear.model.js'
import settingModel from "../models/setting.model.js";
import supporterDayModel from "../models/supporterDay.model.js";
import { addToSupportMailinglist, sendMailToUser } from "./mail.controller.js";
import BaseController from './base.controller.js'
import { isLT } from '../middleware/auth.js'

class SupporterYearController extends BaseController {
	constructor() {
		super({ model: supporterYearModel, paramKey: 'uuid' })
	}

	findAll() {
		return async (req, res) => {
			if (!isLT(req)) {
				res.status(403).send()
				return;
			}
			let data = {}
			data['include'] = { model: supporterDayModel }
			data['where'] = req.query
			const supporterYear = await supporterYearModel.findAll(data)
			res.status(200).send(supporterYear)
		}
	}

	findOne() {
		return async (req, res) => {
			if (!req.params || !req.params.uuid) {
				res.status(400).send('bad request')
				return;
			}
			if (!isLT(req)) {
				res.status(403).send()
				return;
			}
			const supporterYear = await supporterYearModel.findOne({ where: { uuid: req.params.uuid } })
			if (supporterYear) {
				res.status(200).send(supporterYear)
			} else {
				res.status(404).send('not found')
			}
		}
	}

	create() {
		return async (req, res) => {
			const year = (await settingModel.findByPk('currentYear')).value
			var data = req.body
			data.year = year
			data.isConfirmed = false;
			data.internalComment = ''
			const supporterYear = await supporterYearModel.create(data)
			for (const day of req.body.days) {
				await supporterDayModel.create({
					uuid: supporterYear.uuid,
					day: day,
					status: 1
				})
			}
			res.status(200).send()
		}
	}

	update() {
		return async (req, res) => {
			const year = (await settingModel.findByPk('currentYear')).value
			if (!isLT(req)) {
				res.status(403).send()
				return;
			}
			if (!req.params.uuid) {
				res.status(400).send('bad request')
				return;
			}
			const supporterYear = await supporterYearModel.findByPk(req.params.uuid)
			if (!supporterYear) {
				res.status(404).send('not found')
				return;
			}
			if (!supporterYear.isConfirmed && req.body.isConfirmed) {
				addToSupportMailinglist(supporterYear.mail, year);
				sendMailToUser(req.params.uuid, 'confirmation', 'supporter');
			}
			await supporterYearModel.update(req.body, { where: { uuid: req.params.uuid } });
			res.status(200).send()
		}
	}
}

export default new SupporterYearController()
