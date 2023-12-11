import featureModel from '../models/feature.model.js'

export async function findAll(req, res) {
	try {
		const feature = await featureModel.findAll({where: req.query})
		res.status(200).send(feature)
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
	const feature = await featureModel.findByPk(req.params.id)
	if (feature) {
		res.status(200).send(feature)
	} else {
		res.status(404).send('not found')
	}
}

export async function create(req, res) {
	if (!req.body) {
		res.status(400).send('bad request')
		return;
	}
	let data = req.body
	featureModel.create(data)
	res.status(200).send()
}

export async function update(req, res) {
	if (!req.params || !req.params.id) {
		res.status(400).send('bad request')
		return;
	}
	const feature = await featureModel.findByPk(req.params.id)
	if (feature) {
		featureModel.update(req.body, {where: {id: req.params.id}});
		res.status(200).send(feature)
	} else {
		res.status(404).send('not found')
	}
}