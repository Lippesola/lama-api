const userEngagementModel = require("../models/userEngagement.model");
const keycloak = require('../config/keycloak.js').getKeycloak();

exports.findAll = async (req, res) => {
	const userEngagement = await userEngagementModel.findAll({where: req.params})
	res.status(200).json(userEngagement)
}

exports.findOne = async (req, res) => {
	if (!req.params && !req.params.uuid && !req.params.year) {
		res.status(400).send('bad request')
		return;
	}
	const userEngagement = await userEngagementModel.findOne({where: {uuid: req.params.uuid, year: req.params.year}})
	if (userEngagement) {
		res.status(200).json(userEngagement)
	} else {
		res.status(404).send('not found')
	}
}

exports.createOrUpdate = async (req, res) => {
	if (!req.params && !req.params.uuid && !req.params.year) {
		res.status(400).send('bad request')
		return;
	}
	const userEngagement = await userEngagementModel.findOne({where: {uuid: req.params.uuid, year: req.params.year}})
	if (userEngagement) {
		userEngagementModel.update(req.body, {where: {uuid: req.params.uuid, year: req.params.year}});
		res.status(200).json(userEngagement)
	} else {
		var data = req.body
		data.uuid = req.params.uuid
		data.year = req.params.year
		userEngagementModel.create(data)
		res.status(200).json(userEngagement)
	}
}