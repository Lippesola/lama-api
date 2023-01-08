const eventModel = require("../models/event.model");
const keycloak = require('../config/keycloak.js').getKeycloak();

exports.findAll = async (req, res) => {
	const event = await eventModel.findAll({where: req.params})
	res.status(200).json(event)
}

exports.findOne = async (req, res) => {
	if (!req.params && !req.params.id) {
		res.status(400).send('bad request')
		return;
	}
	const event = await eventModel.findByPk(req.params.id)
	if (event) {
		res.status(200).json(event)
	} else {
		res.status(404).send('not found')
	}
}

exports.createOrUpdate = async (req, res) => {
	if (!req.params && !req.params.id) {
		res.status(400).send('bad request')
		return;
	}
	const event = await eventModel.findByPk(req.params.id)
	if (event) {
		eventModel.update(req.body, {where: {id: req.params.id}});
		res.status(200).json(event)
	} else {
		var data = req.body
		data.id = req.params.id
		eventModel.create(data)
		res.status(200).json(event)
	}
}