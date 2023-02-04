import responsibilityModel from '../models/responsibility.model.js'

export async function findAll(req, res) {
	try {
		const responsibility = await responsibilityModel.findAll({where: req.query})
		res.status(200).send(responsibility)
	} catch(e) {
		res.status(400).send()
	}
}

export async function findOne(req, res) {
	if (!req.params || !req.params.id) {
		res.status(400).send('bad request')
		return;
	}
	const responsibility = await responsibilityModel.findByPk(req.params.id)
	if (responsibility) {
		res.status(200).send(responsibility)
	} else {
		res.status(404).send('not found')
	}
}

export async function create(req, res) {
	const responsibility = responsibilityModel.create(req.body)
	res.status(200).send(responsibility)
	return;
}

export async function update(req, res) {
	const responsibility = await responsibilityModel.findByPk(req.params.id)
	if (responsibility) {
		responsibilityModel.update(req.body, {where: {id: req.params.id}});
		res.status(200).send(responsibility)
	} else {
		res.status(404).send()
	}
}