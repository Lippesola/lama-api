import motivationModel from '../models/motivation.model.js'

export async function findAll(req, res) {
	try {
		const motivation = await motivationModel.findAll({where: req.query, order: [['prio', 'ASC']]})
		res.status(200).send(motivation)
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
	const motivation = await motivationModel.findByPk(req.params.id)
	if (motivation) {
		res.status(200).send(motivation)
	} else {
		res.status(404).send('not found')
	}
}

export async function update(req, res) {
	if (Array.isArray(req.body)) {
		await motivationModel.destroy({where: {}})
		await motivationModel.bulkCreate(req.body)
		res.status(200).send()
		return;
	} else {
		res.status(400).send('bad request')
		return;
	}
}