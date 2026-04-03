import userMotivationModel from '../models/userMotivation.model.js'
import BaseController from './base.controller.js'
import { isLT, selfOrLT } from '../middleware/auth.js'

class UserMotivationController extends BaseController {
	constructor() {
		super({ model: userMotivationModel, paramKey: 'uuid' })
	}

	findAll() {
		return async (req, res) => {
			if (!isLT(req)) {
				res.status(403).send()
				return
			}
			try {
				const result = await userMotivationModel.findAll({ where: req.query })
				res.status(200).send(result)
			} catch (e) {
				res.status(400).send()
			}
		}
	}

	createOrUpdate() {
		return async (req, res) => {
			if (!selfOrLT(req, 'uuid')) {
				res.status(403).send()
				return
			}
			if (!req.params?.uuid || !req.body?.motivation) {
				res.status(400).send('bad request')
				return
			}
			const record = await userMotivationModel.findOne({ where: { uuid: req.params.uuid } })
			if (record) {
				await userMotivationModel.update(req.body, { where: { uuid: req.params.uuid } })
				res.status(200).send(record)
			} else {
				const data = { ...req.body, uuid: req.params.uuid }
				const created = await userMotivationModel.create(data)
				res.status(200).send(created)
			}
		}
	}
}

export default new UserMotivationController()
