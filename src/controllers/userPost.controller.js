import userPostModel from '../models/userPost.model.js'

export async function findAll(req, res) {
	try {
		const userPost = await userPostModel.findAll({where: req.query})
		res.status(200).send(userPost)
	} catch(e) {
		res.status(400).send()
	}
}

export async function findOne(req, res) {
	if (!req.params || !req.params.uuid || !req.params.post ) {
		res.status(400).send('bad request')
		return;
	}
	const userPost = await userPostModel.findOne({where: {uuid: req.params.uuid, postId: req.params.post}})
	if (userPost) {
		res.status(200).send(userPost)
	} else {
		res.status(404).send('not found')
	}
}

export async function createOrUpdate(req, res) {
	if (!req.params || !req.params.uuid || !req.params.post ) {
		res.status(400).send('bad request')
		return;
	}
	if (req.params.uuid !== req.kauth.grant.access_token.content.sub) {
		res.status(403).send()
		return;
	}
	const userPost = await userPostModel.findOne({where: {uuid: req.params.uuid, postId: req.params.post}})
	if (userPost) {
		userPostModel.update(req.body, {where: {uuid: req.params.uuid, postId: req.params.post}});
		res.status(200).send(userPost)
	} else {
		var data = req.body
		data.uuid = req.params.uuid
		data.postId = req.params.post
		userPostModel.create(data)
		res.status(200).send(userPost)
	}
}