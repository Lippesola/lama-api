const userTaskModel = require("../models/userTask.model");
const keycloak = require('../config/keycloak.js').getKeycloak();

exports.findAll = async (req, res) => {
	const userTask = await userTaskModel.findAll({where: req.params})
	res.status(200).json(userTask)
}

exports.findOne = async (req, res) => {
	if (!req.params && !req.params.uuid && !req.params.task) {
		res.status(400).send('bad request')
		return;
	}
	const userTask = await userTaskModel.findOne({where: {uuid: req.params.uuid, task: req.params.task}})
	if (userTask) {
		res.status(200).json(userTask)
	} else {
		res.status(404).send('not found')
	}
}

exports.createOrUpdate = async (req, res) => {
	if (!req.params && !req.params.uuid && !req.params.task) {
		res.status(400).send('bad request')
		return;
	}
	const userTask = await userTaskModel.findOne({where: {uuid: req.params.uuid, task: req.params.task}})
	if (userTask) {
		userTaskModel.update(req.body, {where: {uuid: req.params.uuid, task: req.params.task}});
		res.status(200).json(userTask)
	} else {
		var data = req.body
		data.uuid = req.params.uuid
		data.task = req.params.task
		userTaskModel.create(data)
		res.status(200).json(userTask)
	}
}