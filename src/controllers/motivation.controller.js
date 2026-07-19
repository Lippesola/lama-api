import motivationModel from '../models/motivation.model.js'
import BaseController from './base.controller.js'

class MotivationController extends BaseController {
	constructor() {
		super({ model: motivationModel, paramKey: 'id', findAllOptions: { order: [['prio', 'ASC']] } })
	}

	replaceAll() {
		return async (req, res) => {
			if (!Array.isArray(req.body)) {
				res.status(400).send('bad request')
				return
			}
			await motivationModel.destroy({ where: {} })
			await motivationModel.bulkCreate(req.body)
			res.status(200).send()
		}
	}
}

export default new MotivationController()
