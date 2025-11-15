import userCommentModel from '../models/userComment.model.js'

export async function findAll(req, res) {
	const isLT = req.kauth.grant.access_token.content.groups?.includes('Leitungsteam')
	if (!isLT) {
		res.status(403).send()
		return;
	}
	try {
		const userComment = await userCommentModel.findAll({where: req.query})
		res.status(200).send(userComment)
	} catch(e) {
		res.status(400).send()
	}
}

export async function findOne(req, res) {
	if (!req.params || !req.params.uuid ) {
		res.status(400).send('bad request')
		return;
	}
	const isLT = req.kauth.grant.access_token.content.groups?.includes('Leitungsteam')
	if (!isLT) {
		res.status(403).send()
		return;
	}
	const userComment = await userCommentModel.findOne({where: {uuid: req.params.uuid}})
	if (userComment) {
		res.status(200).send(userComment)
	} else {
		res.status(404).send('not found')
	}
}

export async function createOrUpdate(req, res) {
	const isLT = req.kauth.grant.access_token.content.groups?.includes('Leitungsteam')
	if (!isLT) {
		res.status(403).send()
		return;
	}
	if (!req.params?.uuid) {
		res.status(400).send('bad request')
		return;
	}
	const userComment = await userCommentModel.findOne({where: {uuid: req.params.uuid}})
	if (userComment) {
		userCommentModel.update(req.body, {where: {uuid: req.params.uuid}});
		res.status(200).send(userComment)
	} else {
		var data = req.body
		data.uuid = req.params.uuid
		userCommentModel.create(data)
		res.status(200).send(userComment)
	}
}