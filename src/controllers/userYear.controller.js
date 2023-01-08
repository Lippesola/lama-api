const userYearModel = require("../models/userYear.model");
const keycloak = require('../config/keycloak.js').getKeycloak();

exports.findAll = async (req, res) => {
	const userYear = await userYearModel.findAll({where: req.params})
	res.status(200).json(userYear)
}

exports.findOne = async (req, res) => {
	if (!req.params && !req.params.uuid && !req.params.year) {
		res.status(400).send('bad request')
		return;
	}
	const userYear = await userYearModel.findOne({where: {uuid: req.params.uuid, year: req.params.year}})
	if (userYear) {
		res.status(200).json(userYear)
	} else {
		res.status(404).send('not found')
	}
}

exports.createOrUpdate = async (req, res) => {
	if (!req.params && !req.params.uuid && !req.params.year) {
		res.status(400).send('bad request')
		return;
	}
	const userYear = await userYearModel.findOne({where: {uuid: req.params.uuid, year: req.params.year}})
	var data = req.body
	data.editedBy = req.kauth.grant.access_token.content.sub
	if (userYear) {
		userYearModel.update(data, {where: {uuid: req.params.uuid, year: req.params.year}});
		res.status(200).json(userYear)
	} else {
		data.uuid = req.params.uuid
		data.year = req.params.year
		userYearModel.create(data)
		res.status(200).json(userYear)
	}
}