import userMotivationModel from '../models/userMotivation.model.js'
import settingModel from '../models/setting.model.js'

export async function findAll(req, res) {
	const year = req.query.year || await settingModel.findByPk('currentYear')
	const isLT = req.kauth.grant.access_token.content.groups?.includes(year + '_LT')
	if (!isLT) {
		res.status(403).send()
		return;
	}
	try {
		const userMotivation = await userMotivationModel.findAll({where: req.query})
		res.status(200).send(userMotivation)
	} catch(e) {
		res.status(400).send()
	}
}

export async function findOne(req, res) {
	if (!req.params || !req.params.uuid ) {
		res.status(400).send('bad request')
		return;
	}
	const executingUser = req.kauth.grant.access_token.content.sub
	const isSelf = executingUser === req.params.uuid
	const year = (await settingModel.findByPk('currentYear')).value
	const isLT = req.kauth.grant.access_token.content.groups?.includes(year + '_LT')
	const allowed = isLT || isSelf
	if (!allowed) {
		res.status(403).send()
		return;
	}
	const userMotivation = await userMotivationModel.findOne({where: {uuid: req.params.uuid}})
	if (userMotivation) {
		res.status(200).send(userMotivation)
	} else {
		res.status(404).send('not found')
	}
}

export async function createOrUpdate(req, res) {
	const executingUser = req.kauth.grant.access_token.content.sub
	const isSelf = executingUser === req.params.uuid
	const year = (await settingModel.findByPk('currentYear')).value
	const isLT = req.kauth.grant.access_token.content.groups?.includes(year + '_LT')
	const allowed = isLT || isSelf
	if (!allowed) {
		res.status(403).send()
		return;
	}
	if (!req.params || !req.params.uuid || !req.body || !req.body.motivation) {
		res.status(400).send('bad request')
		return;
	}
	const userMotivation = await userMotivationModel.findOne({where: {uuid: req.params.uuid}})
	if (userMotivation) {
		userMotivationModel.update(req.body, {where: {uuid: req.params.uuid}});
		res.status(200).send(userMotivation)
	} else {
		var data = req.body
		data.uuid = req.params.uuid
		userMotivationModel.create(data)
		res.status(200).send(userMotivation)
	}
}