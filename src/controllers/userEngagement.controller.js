import UserEngagementModel from '../models/userEngagement.model.js'
import UserYearModel from '../models/userYear.model.js'
import SettingModel from '../models/setting.model.js'
import keycloak from '../config/keycloak.js';
import { ValidationError } from 'sequelize';

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
	const executingUser = req.kauth.grant.access_token.content.sub
	const isAdmin = req.kauth.grant.access_token.content.group.includes('admin')
  
	if (req.params.uuid !== executingUser && !isAdmin) {
	  return res.status(403).send({
		message: "Forbidden!"
	  });
	}
	const userEngagement = await UserEngagementModel.findOne({where: {uuid: req.params.uuid, year: req.params.year}})
	if (userEngagement) {
		try {
			await UserEngagementModel.update(req.body, {where: {uuid: req.params.uuid, year: req.params.year}});
		} catch(e) {
			if (e instanceof ValidationError) {
				let returnErrors = []
				e.errors.forEach((error) => {
					returnErrors.push(error.path)
					console.log(error);
				})
				res.status(400).send(returnErrors)
			}
			res.status(500).send()
			return
		}
		const year = await SettingModel.findByPk('currentYear')
		const userYear = await UserYearModel.findOne({
			where: {
				uuid: req.params.uuid,
				year: year.value
			}
		})
		if (userYear.status == 2) {
			UserYearModel.update({status: 3, editedBy: req.kauth.grant.access_token.content.sub}, {
				where: {
					uuid: req.params.uuid,
					year: year.value
				}
			})
		}
		res.status(200).send(userEngagement)
	} else {
		var data = req.body
		data.uuid = req.params.uuid
		data.year = req.params.year
		UserEngagementModel.create(data)
		res.status(200).send(userEngagement)
	}
}