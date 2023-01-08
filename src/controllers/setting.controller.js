const settingModel = require("../models/setting.model");
const keycloak = require('../config/keycloak.js').getKeycloak();

exports.findAll = async (req, res) => {
	const setting = await settingModel.findAll({where: req.params})
	res.status(200).json(setting)
}

exports.findOne = async (req, res) => {
	if (!req.params && !req.params.key) {
		res.status(400).send('bad request')
		return;
	}
	const setting = await settingModel.findByPk(req.params.key)
	if (setting) {
		res.status(200).json(setting)
	} else {
		res.status(404).send('not found')
	}
}

exports.createOrUpdate = async (req, res) => {
	if (!req.params && !req.params.key) {
		res.status(400).send('bad request')
		return;
	}
	const setting = await settingModel.findByPk(req.params.key)
	if (setting) {
		settingModel.update(req.body, {where: {key: req.params.key}});
		res.status(200).json(setting)
	} else {
		var data = req.body
		data.key = req.params.key
		settingModel.create(data)
		res.status(200).json(setting)
	}
}