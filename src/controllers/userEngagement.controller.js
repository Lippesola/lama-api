import UserEngagementModel from '../models/userEngagement.model.js'
import keycloak from '../config/keycloak.js';

export async function findAll(req, res) {
	const userEngagement = await UserEngagementModel.findAll({where: req.params})
	res.status(200).send(userEngagement)
}

export async function findOne(req, res) {
	if (!req.params && !req.params.uuid && !req.params.year) {
		res.status(400).send('bad request')
		return;
	}
	const userEngagement = await UserEngagementModel.findOne({where: {uuid: req.params.uuid, year: req.params.year}})
	if (userEngagement) {
		res.status(200).send(userEngagement)
	} else {
		res.status(404).send('not found')
	}
}

export async function createOrUpdate(req, res) {
	if (!req.params && !req.params.uuid && !req.params.year) {
		res.status(400).send('bad request')
		return;
	}
	const userEngagement = await UserEngagementModel.findOne({where: {uuid: req.params.uuid, year: req.params.year}})
	if (userEngagement) {
		UserEngagementModel.update(req.body, {where: {uuid: req.params.uuid, year: req.params.year}});
		res.status(200).send(userEngagement)
	} else {
		var data = req.body
		data.uuid = req.params.uuid
		data.year = req.params.year
		UserEngagementModel.create(data)
		res.status(200).send(userEngagement)
	}
}