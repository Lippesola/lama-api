import EventModel from '../models/event.model.js'
import keycloak from '../config/keycloak.js';

export async function findAll(req, res) {
	const event = await EventModel.findAll({where: req.params})
	res.status(200).send(event)
}

export async function findOne(req, res) {
	if (!req.params && !req.params.id) {
		res.status(400).send('bad request')
		return;
	}
	const event = await EventModel.findByPk(req.params.id)
	if (event) {
		res.status(200).send(event)
	} else {
		res.status(404).send('not found')
	}
}

export async function createOrUpdate(req, res) {
	if (!req.params && !req.params.id) {
		res.status(400).send('bad request')
		return;
	}
	const event = await EventModel.findByPk(req.params.id)
	if (event) {
		EventModel.update(req.body, {where: {id: req.params.id}});
		res.status(200).send(event)
	} else {
		var data = req.body
		data.id = req.params.id
		EventModel.create(data)
		res.status(200).send(event)
	}
}