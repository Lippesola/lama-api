import UserYearModel from '../models/userYear.model.js'
import keycloak from '../config/keycloak.js';

export async function findAll(req, res) {
	const userYear = await UserYearModel.findAll({where: req.params})
	res.status(200).send(userYear)
}

export async function findOne(req, res) {
	if (!req.params && !req.params.uuid && !req.params.year) {
		res.status(400).send('bad request')
		return;
	}
	const userYear = await UserYearModel.findOne({where: {uuid: req.params.uuid, year: req.params.year}})
	if (userYear) {
		res.status(200).send(userYear)
	} else {
		res.status(404).send('not found')
	}
}

export async function createOrUpdate(req, res) {
	if (!req.params && !req.params.uuid && !req.params.year) {
		res.status(400).send('bad request')
		return;
	}
	const userYear = await UserYearModel.findOne({where: {uuid: req.params.uuid, year: req.params.year}})
	var data = req.body
	data.editedBy = req.kauth.grant.access_token.content.sub
	if (userYear) {
		UserYearModel.update(data, {where: {uuid: req.params.uuid, year: req.params.year}});
		res.status(200).send(userYear)
	} else {
		data.uuid = req.params.uuid
		data.year = req.params.year
		UserYearModel.create(data)
		res.status(200).send(userYear)
	}
}