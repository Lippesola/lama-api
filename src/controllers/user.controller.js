import userModel from '../models/user.model.js'
import userYearModel from '../models/userYear.model.js'
import settingModel from '../models/setting.model.js'
import BaseController from './base.controller.js'
import { isLT, isTeam, isSelf, getTokenContent } from '../middleware/auth.js'

class UserController extends BaseController {
	constructor() {
		super({ model: userModel, paramKey: 'uuid' })
	}

	findAll() {
		return async (req, res) => {
			const year = req.query.year || (await settingModel.findByPk('currentYear')).value
			const userIsTeam = isTeam(req, year)
			const userIsLT = isLT(req)
			let findAllConfig = {}
			let userWhere = req.query
			let userYearWhere = {}
			let attributes = []
			delete userWhere.year
			userYearWhere['year'] = year
			userYearWhere['status'] = 4
			if (!userIsTeam) {
				res.status(403).send()
				return
			}
			if (!userIsLT) {
				Object.entries(userModel.rawAttributes).forEach(([key, value]) => {
					if (value.public) {
						attributes.push(value.field);
					} else {
						delete userWhere[value.field]
					}
				})
				userYearWhere['status'] = 4
			}
			if (attributes.length > 0) {
				findAllConfig['attributes'] = attributes
			}
			findAllConfig['include'] = {
				attributes: [],
				model: userYearModel,
				where: userYearWhere
			}
			findAllConfig['where'] = userWhere
			try {
				const user = await userModel.findAll(findAllConfig)
				res.status(200).send(user)
			} catch(e) {
				console.log(e);
				res.status(400).send()
			}
		}
	}

	findOne() {
		return async (req, res) => {
			if (!req.params || !req.params.uuid) {
				res.status(400).send('bad request')
				return;
			}
			const year = (await settingModel.findByPk('currentYear')).value
			const userIsTeam = isTeam(req, year)
			const userIsLT = isLT(req)
			const self = isSelf(req, 'uuid')
			let attributes = []
			if (!userIsTeam && !self) {
				res.status(403).send()
				return
			}
			if (!userIsLT && !self) {
				Object.entries(userModel.rawAttributes).forEach(([key, value]) => {
					if (value.public) {
						attributes.push(value.field);
					}
				})
			}
			let findByPkConfig = {}
			if (attributes.length > 0) {
				findByPkConfig['attributes'] = attributes
			}
			const user = await userModel.findByPk(req.params.uuid, findByPkConfig)
			if (user) {
				res.status(200).send(user)
			} else {
				res.status(404).send('not found')
			}
		}
	}

	createOrUpdate() {
		return async (req, res) => {
			if (!req.params || !req.params.uuid) {
				res.status(400).send('bad request')
				return;
			}
			const self = isSelf(req, 'uuid')
			const userIsLT = isLT(req)
			if (!self && !userIsLT) {
				res.status(403).send()
				return;
			}
			const user = await userModel.findByPk(req.params.uuid)
			if (user) {
				let data = {}
				Object.entries(req.body).forEach(([key, value]) => {
					if (value === null) {
						data[key] = ''
					} else {
						data[key] = value
					}
				})
				await userModel.update(data, { where: { uuid: req.params.uuid } });
				const year = (await settingModel.findByPk('currentYear')).value
				const userYear = await userYearModel.findOne({
					where: { uuid: req.params.uuid, year: year }
				})
				if (!userYear) {
					await userYearModel.create({
						uuid: req.params.uuid,
						year: year,
						status: 1,
						editedBy: getTokenContent(req).sub
					})
				} else if (userYear.status == 0) {
					await userYearModel.update({ status: 1, editedBy: getTokenContent(req).sub }, {
						where: { uuid: req.params.uuid, year: year }
					})
				}
				res.status(200).send(user)
			} else {
				var data = req.body
				data.uuid = req.params.uuid
				await userModel.create(data)
				res.status(200).send(user)
			}
		}
	}
}

export default new UserController()
