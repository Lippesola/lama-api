import userDocumentModel from '../models/userDocument.model.js'
import settingModel from '../models/setting.model.js'

export async function findAll(req, res) {
	const year = req.query.year || await settingModel.findByPk('currentYear')
	const isLT = req.kauth.grant.access_token.content.groups.includes(year + '_LT')
	if (!isLT) {
		res.status(403).send()
		return;
	}
	try {
		const userDocument = await userDocumentModel.findAll({where: req.query})
		res.status(200).send(userDocument)
	} catch(e) {
		res.status(400).send()
	}
}

export async function findOne(req, res) {
	if (!req.params || !req.params.uuid ) {
		res.status(400).send('bad request')
		return;
	}
	const year = req.query.year || (await settingModel.findByPk('currentYear')).value
	const isLT = req.kauth.grant.access_token.content.groups.includes(year + '_LT')
	const isSelf = req.kauth.grant.access_token.content.sub === req.params.uuid
	if (!isLT && !isSelf) {
		res.status(403).send()
		return;
	}
	const userDocument = await userDocumentModel.findOne({where: {uuid: req.params.uuid}})
	if (userDocument) {
		res.status(200).send(userDocument)
	} else {
		res.status(404).send('not found')
	}
}

export async function createOrUpdate(req, res) {
	const year = (await settingModel.findByPk('currentYear')).value
	const isLT = req.kauth.grant.access_token.content.groups.includes(year + '_LT')
	if (!isLT) {
		res.status(403).send()
		return;
	}
	if (!req.params || !req.params.uuid || (!req.body.criminalRecord && !req.body.selfCommitment)) {
		res.status(400).send('bad request')
		return;
	}
	const userDocument = await userDocumentModel.findOne({where: {uuid: req.params.uuid}})
	if (userDocument) {
		userDocumentModel.update(req.body, {where: {uuid: req.params.uuid}});
		res.status(200).send(userDocument)
	} else {
		var data = req.body
		data.uuid = req.params.uuid
		userDocumentModel.create(data)
		res.status(200).send(userDocument)
	}
}