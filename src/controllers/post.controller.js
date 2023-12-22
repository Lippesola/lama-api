import postModel from '../models/post.model.js'
import settingModel from '../models/setting.model.js'

export async function findAll(req, res) {
	try {
		const post = await postModel.findAll({where: req.query})
		res.status(200).send(post)
	} catch(e) {
		res.status(400).send()
	}
}

export async function findOne(req, res) {
	if (!req.params || !req.params.id ) {
		res.status(400).send('bad request')
		return;
	}
	const post = await postModel.findByPk(req.params.id)
	if (post) {
		res.status(200).send(post)
	} else {
		res.status(404).send('not found')
	}
}

export async function create(req, res) {
	if (!req.body || !req.body.threadId || !req.body.text) {
		res.status(400).send('bad request')
		return;
	}
	let data = req.body
	data.createdBy = req.kauth.grant.access_token.content.sub
	postModel.create(data)
	res.status(200).send()
}

export async function update(req, res) {
	if (!req.params || !req.params.id) {
		res.status(400).send('bad request')
		return;
	}
	const year = (await settingModel.findByPk('currentYear')).value
	const isLT = req.kauth.grant.access_token.content.groups?.includes(year + '_LT')
	const post = await postModel.findByPk(req.params.id)
	if (post) {
		if (req.kauth.grant.access_token.content.sub !== post.createdBy && !isLT) {
			res.status(403).send()
			return;
		}
		postModel.update(req.body, {where: {id: req.params.id}});
		res.status(200).send(post)
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
	const post = await postModel.findByPk(req.params.id)
	if (post) {
		if (req.kauth.grant.access_token.content.sub !== post.createdBy && !isLT) {
			res.status(403).send()
			return;
		}
		postModel.destroy({where: {id: req.params.id}});
		res.status(200).send(post)
	} else {
		res.status(404).send('not found')
	}
}