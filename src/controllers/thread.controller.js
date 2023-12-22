import threadModel from '../models/thread.model.js'
import settingModel from '../models/setting.model.js'
import postModel from '../models/post.model.js'
import userPostModel from '../models/userPost.model.js'

export async function findAll(req, res) {
	try {
		const thread = await threadModel.findAll({where: req.query})
		res.status(200).send(thread)
	} catch(e) {
		res.status(400).send()
	}
}

export async function findOne(req, res) {
	if (!req.params || !req.params.id ) {
		res.status(400).send('bad request')
		return;
	}
	const thread = await threadModel.findByPk(req.params.id)
	if (thread) {
		res.status(200).send(thread)
	} else {
		res.status(404).send('not found')
	}
}

export async function create(req, res) {
	if (!req.body || !req.body.title) {
		res.status(400).send('bad request')
		return;
	}
	const thread = await threadModel.create(req.body)
	res.status(200).send(thread)
}

export async function update(req, res) {
	if (!req.params || !req.params.id) {
		res.status(400).send('bad request')
		return;
	}
	const year = (await settingModel.findByPk('currentYear')).value
	const isLT = req.kauth.grant.access_token.content.groups?.includes(year + '_LT')
	const thread = await threadModel.findByPk(req.params.id)
	const posts = await postModel.findAll({where: {threadId: req.params.id}})
	if (thread) {
		if ((req.kauth.grant.access_token.content.sub !== posts[0]['createdBy']) && !isLT) {
			res.status(403).send()
			return;
		}
		threadModel.update(req.body, {where: {id: req.params.id}});
		res.status(200).send(thread)
	} else {
		res.status(404).send('not found')
	}
}

export async function deleteOne(req, res) {
	if (!req.params || !req.params.id) {
		res.status(400).send('bad request')
		return;
	}
	const year = (await settingModel.findByPk('currentYear')).value
	const isLT = req.kauth.grant.access_token.content.groups?.includes(year + '_LT')
	const thread = await threadModel.findByPk(req.params.id)
	if (thread) {
		const posts = await postModel.findAll({where: {threadId: req.params.id}})
		if ((req.kauth.grant.access_token.content.sub !== posts[0]['createdBy']) && !isLT) {
			res.status(403).send()
			return;
		}
		threadModel.destroy({where: {id: req.params.id}});
		res.status(200).send(thread)
	} else {
		res.status(404).send('not found')
	}
}