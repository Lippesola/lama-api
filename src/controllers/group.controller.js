import groupModel from '../models/group.model.js'
import groupUserModel from '../models/groupUser.model.js'
import preferenceModel from '../models/preference.model.js'
import participatorModel from '../models/participator.model.js'
import settingModel from '../models/setting.model.js'
import userYearModel from '../models/userYear.model.js'
import userModel from '../models/user.model.js'
import BaseController from './base.controller.js'
import { isLT } from '../middleware/auth.js'
import { findAllParticipators } from './participator.controller.js'

class GroupController extends BaseController {
	constructor() {
		super({ model: groupModel, paramKey: 'id' })
	}

	findAll() {
		return async (req, res) => {
			let data = { include: [] }
			if (typeof req.query.participatorBundle !== 'undefined') {
				delete req.query.participatorBundle
				data.subQuery = false
				data.include.push({
					model: preferenceModel,
					include: [{ model: participatorModel }]
				})
			}
			if (typeof req.query.groupUserBundle !== 'undefined') {
				delete req.query.groupUserBundle
				data.include.push({ model: groupUserModel })
			}
			try {
				data.where = req.query
				const group = await groupModel.findAll(data)
				res.status(200).send(group)
			} catch (e) {
				console.log(e)
				res.status(400).send()
			}
		}
	}

	create() {
		return async (req, res) => {
			if (!req.body?.year || !req.body?.week) {
				console.log(req.body)
				res.status(400).send('bad request')
				return
			}
			const data = { ...req.body }
			if (!data.groupNumber) data.groupNumber = null
			await groupModel.create(data)
			res.status(200).send()
		}
	}

	update() {
		return async (req, res) => {
			if (!this._validateParams(req, res)) return
			const group = await this._findRecord(req)
			if (!group) {
				res.status(404).send('not found')
				return
			}
			if (!isLT(req)) {
				res.status(403).send()
				return
			}
			await this.model.update(req.body, { where: { id: req.params.id } })
			res.status(200).send(group)
		}
	}

	deleteOne() {
		return async (req, res) => {
			if (!this._validateParams(req, res)) return
			const group = await this._findRecord(req)
			if (!group) {
				res.status(404).send('not found')
				return
			}
			if (!isLT(req)) {
				res.status(403).send()
				return
			}
			await this.model.destroy({ where: { id: req.params.id } })
			res.status(200).send(group)
		}
	}

	autoSort() {
		return async (req, res) => {
			if (!req.params?.year || !req.params?.week) {
				res.status(400).send('bad request')
				return
			}
			const weekString = req.params.week === 1 ? 'teens' : req.params.week === 2 ? 'kids' : req.params.week
			const weekNumber = req.params.week === 'teens' ? 1 : req.params.week === 'kids' ? 2 : req.params.week
			const year = req.params.year
			const groups = await groupModel.findAll({ where: { year: year, week: weekNumber } })
			const preferences = await preferenceModel.findAll({ where: { groupId: groups.map(group => group.id) } })
			if (preferences.length) {
				res.status(400).send('already sorted')
				return
			}
			let participators = Object.values(await findAllParticipators())
				.filter(p => p.week === weekString && p.status === 1)
			participators.forEach(participator => {
				const groupId = participator.groupId || Math.random()
				participator.groupId = groupId
				if (participator.wishes === "Ja") {
					let wishes = []
					for (let i = 1; i <= 5; i++) {
						if (participator[`wish${i}`]) wishes.push(participator[`wish${i}`])
					}
					wishes.forEach(wish => {
						const wishParticipator = participators.find(p => {
							const firstNames = p.firstName.split(' ')
							const lastName = p.lastName
							return firstNames.some(firstName => wish.includes(firstName)) && wish.includes(lastName)
						})
						if (wishParticipator) {
							if (wishParticipator.groupId) {
								const gId = wishParticipator.groupId
								participators.forEach(p => {
									if (p.groupId === gId) p.groupId = groupId
								})
							} else {
								const index = participators.findIndex(p => p.orderId === wishParticipator.orderId && p.positionId === wishParticipator.positionId)
								participators[index].groupId = groupId
							}
						}
					})
				}
			})
			const group1 = groups.find(group => group.groupNumber === 1)
			let groupIds = participators.map(p => p.groupId)
			groupIds = groupIds.filter((groupId, index) => groupIds.indexOf(groupId) === index)
			for (const groupId of groupIds) {
				const currentParticipators = participators.filter(participator => participator.groupId === groupId)
				if (currentParticipators.length === 1) continue
				const preference = await preferenceModel.create({ groupId: group1.id })
				for (const participator of currentParticipators) {
					await participatorModel.update({ preferenceId: preference.id }, { where: { orderId: participator.orderId, positionId: participator.positionId } })
				}
			}
			res.status(200).send()
		}
	}
}

export default new GroupController()
