const userModel = require("../models/user.model");
const keycloak = require('../config/keycloak.js').getKeycloak();

exports.findAll = async (req, res) => {
	const user = await userModel.findAll({where: req.params})
	res.status(200).json(user)
}

exports.findOne = async (req, res) => {
	if (!req.params && !req.params.uuid) {
		res.status(400).send('bad request')
		return;
	}
	const user = await userModel.findByPk(req.params.uuid)
	if (user) {
		res.status(200).json(user)
	} else {
		res.status(404).send('not found')
	}
}

exports.createOrUpdate = async (req, res) => {
	if (!req.params && !req.params.uuid) {
		res.status(400).send('bad request')
		return;
	}
	const user = await userModel.findByPk(req.params.uuid)
	if (user) {
		userModel.update(req.body, {where: {uuid: req.params.uuid}});
		res.status(200).json(user)
	} else {
		var data = req.body
		data.uuid = req.params.uuid
		userModel.create(data)
		res.status(200).json(user)
	}
}