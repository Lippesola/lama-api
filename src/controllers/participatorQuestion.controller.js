import participatorQuestionModel from '../models/participatorQuestion.model.js'

export async function findAll(req, res) {
	try {
		const question = await participatorQuestionModel.findAll()
		res.status(200).send(question)
	} catch(e) {
		console.log(e)
		res.status(400).send()
	}
}

export async function findOne(req, res) {
	if (!req.params || !req.params.id ) {
		res.status(400).send('bad request')
		return;
	}
	const question = await participatorQuestionModel.findByPk(req.params.id)
	if (question) {
		res.status(200).send(question)
	} else {
		res.status(404).send('not found')
	}
}

export async function createOrUpdate(req, res) {
	if (!req.params || !req.params.id) {
		res.status(400).send('bad request')
		return;
	}
	const question = await participatorQuestionModel.findByPk(req.params.id)
	if (question) {
		participatorQuestionModel.update(req.body, {where: {id: req.params.id}});
		res.status(200).send(question)
	} else {
		var data = req.body
		data.id = req.params.id
		participatorQuestionModel.create(data)
		res.status(200).send(question)
	}
}