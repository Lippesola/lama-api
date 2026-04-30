import supporterYearModel from '../models/supporterYear.model.js'
import settingModel from "../models/setting.model.js";
import supporterDayModel from "../models/supporterDay.model.js";
import { addToSupportMailinglist, sendMailToUser } from "./mail.controller.js";
import BaseController from './base.controller.js'

class SupporterYearController extends BaseController {
	constructor() {
		super({
			model: supporterYearModel,
			paramKey: 'uuid',
			findAllOptions: { include: supporterDayModel },
		})
	}

	create() {
		return async (req, res) => {
			const year = (await settingModel.findByPk('currentYear')).value
			const data = { ...req.body }
			data.year = year
			data.isConfirmed = false
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
			const record = await this._findRecord(req)
			if (!record) {
				res.status(404).send('not found')
				return
			}
			if (!record.isConfirmed && req.body.isConfirmed) {
				addToSupportMailinglist(record.mail, year)
				sendMailToUser(req.params.uuid, 'confirmation', 'supporter')
			}
			const { days, ...rest } = req.body
			await record.update(rest)
			if (Array.isArray(days)) {
				await supporterDayModel.destroy({ where: { uuid: req.params.uuid } })
				for (const day of days) {
					await supporterDayModel.create({ uuid: req.params.uuid, day, status: 1 })
				}
			}
			res.status(200).send()
		}
	}
}

export default new SupporterYearController()
