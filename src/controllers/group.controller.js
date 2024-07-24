import groupModel from '../models/group.model.js'
import userModel from '../models/user.model.js'
import groupUserModel from '../models/groupUser.model.js'
import preferenceModel from '../models/preference.model.js'
import participatorModel from '../models/participator.model.js'
import userPermissionModel from '../models/userPermission.model.js';
import settingModel from '../models/setting.model.js'
import userYearModel from '../models/userYear.model.js'
import { findAllParticipators } from './participator.controller.js'

async function isAllowed(req) {
	const executingUser = req.kauth.grant.access_token.content.sub
	const year = await settingModel.findByPk('currentYear')
	const isLT = req.kauth.grant.access_token.content.groups?.includes(year + '_LT')
	const allowed = isLT || (await userPermissionModel.findOne({where: { uuid: executingUser, permission: 'participator'}}))?.allowed
	return allowed
}

export async function findAll(req, res) {
	if (res && !await isAllowed(req)) {
		res.status(403).send('Not allowed');
		return;
	}
	let data = {}
	if (typeof req.query.participatorBundle !== 'undefined') {
		delete req.query.participatorBundle
		data.subQuery = false
		data.include = [
			{
				model: preferenceModel,
				include: [
					{
						model: participatorModel
					}
				]
			},
			{
				model: groupUserModel,
				include: [
					{
						model: userModel,
						include: [
							{
								model: userYearModel,
								where: {
									year: (await settingModel.findByPk('currentYear')).value
								}
							}
						]
					}
				]
			}
		]
	}
	try {
		data.where = req.query
		const group = await groupModel.findAll(data)
		res.status(200).send(group)
	} catch(e) {
		console.log(e);
		res.status(400).send()
	}
}

export async function findOne(req, res) {
	if (res && !await isAllowed(req)) {
		res.status(403).send('Not allowed');
		return;
	}
	if (!req.params || !req.params.id ) {
		res.status(400).send('bad request')
		return;
	}
	const group = await groupModel.findByPk(req.params.id)
	if (group) {
		res.status(200).send(group)
	} else {
		res.status(404).send('not found')
	}
}

export async function create(req, res) {
	if (res && !await isAllowed(req)) {
		res.status(403).send('Not allowed');
		return;
	}
	if (!req.body || !req.body.year || !req.body.week) {
		console.log(req.body);
		res.status(400).send('bad request')
		return;
	}
	let data = req.body
	if (!data.groupNumber) {
		data.groupNumber = null
	}
	groupModel.create(data)
	res.status(200).send()
}

export async function update(req, res) {
	if (res && !await isAllowed(req)) {
		res.status(403).send('Not allowed');
		return;
	}
	if (!req.params || !req.params.id) {
		res.status(400).send('bad request')
		return;
	}
	const year = (await settingModel.findByPk('currentYear')).value
	const isLT = req.kauth.grant.access_token.content.groups?.includes(year + '_LT')
	const group = await groupModel.findByPk(req.params.id)
	if (group) {
		if (!isLT) {
			res.status(403).send()
			return;
		}
		groupModel.update(req.body, {where: {id: req.params.id}});
		res.status(200).send(group)
	} else {
		res.status(404).send('not found')
	}
}

export async function deleteOne(req, res) {
	if (res && !await isAllowed(req)) {
		res.status(403).send('Not allowed');
		return;
	}
	if (!req.params || !req.params.id) {
		res.status(400).send('bad request')
		return;
	}
	const year = (await settingModel.findByPk('currentYear')).value
	const isLT = req.kauth.grant.access_token.content.groups?.includes(year + '_LT')
	const group = await groupModel.findByPk(req.params.id)
	if (group) {
		if (!isLT) {
			res.status(403).send()
			return;
		}
		groupModel.destroy({where: {id: req.params.id}});
		res.status(200).send(group)
	} else {
		res.status(404).send('not found')
	}
}

export async function autoSort(req, res) {
	if (res && !await isAllowed(req)) {
		res.status(403).send('Not allowed');
		return;
	}
	if (!req.params || !req.params.year || !req.params.week) {
		res.status(400).send('bad request')
		return;
	}
	const weekString = req.params.week === 1 ? 'teens' : req.params.week === 2 ? 'kids' : req.params.week
	const weekNumber = req.params.week === 'teens' ? 1 : req.params.week === 'kids' ? 2 : req.params.week
	const year = req.params.year
	const groups = await groupModel.findAll({where: {year: year, week: weekNumber}})
	const preferences = await preferenceModel.findAll({where: {groupId: groups.map(group => group.id)}})
	if (preferences.length) {
		res.status(400).send('already sorted')
		return;
	}
	let participators = Object.values(await findAllParticipators())
	.filter(p => 
		p.week === weekString &&
		p.status === 1
	)
	participators.forEach(participator => {
		const groupId = participator.groupId || Math.random()
		participator.groupId = groupId
		if (participator.wishes === "Ja") {
			let wishes = [];
			for (let i = 1; i <= 5; i++) {
				if (participator[`wish${i}`]) {
					wishes.push(participator[`wish${i}`])
				}
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
							if (p.groupId === gId) {
								p.groupId = groupId
							}
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
	groupIds.forEach(async groupId => {
		const currentParticipators = participators.filter(participator => participator.groupId === groupId)
		if (currentParticipators.length === 1) {
			return;
		}
		const preference = await preferenceModel.create({groupId: group1.id});
		for (const participator of currentParticipators) {
			await participatorModel.update({preferenceId: preference.id}, {where: {orderId: participator.orderId, positionId: participator.positionId}})	
		}
	})
	res.status(200).send()
}