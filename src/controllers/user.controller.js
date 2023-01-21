import UserModel from '../models/user.model.js'
import UserYearModel from '../models/userYear.model.js'
import SettingModel from '../models/setting.model.js'
import keycloak from '../config/keycloak.js';
import { ValidationError } from 'sequelize';

export async function findAll(req, res) {
	const year = req.params.year || await SettingModel.findByPk('currentYear')
	const isTeam = req.kauth.grant.access_token.content.groups.includes(year + '_Team')
	const isLT = req.kauth.grant.access_token.content.groups.includes(year + '_LT')
	if (!isTeam) {
		res.status(403)
		return
	} else if (isLT) {
		const user = await UserModel.findAll({
			include: {
				mode: UserYear,
				where: {
					year: year
				}
			},
			where: req.params
		})
	} else {
		const user = await UserModel.findAll({
			include: {
				mode: UserYear,
				where: {
					year: year,
					status: 4
				}
			},
			where: req.params
		})
	}
	res.status(200).send(user)
}

export async function findOne(req, res) {
	if (!req.params && !req.params.uuid) {
		res.status(400).send('bad request')
		return;
	}
	const user = await UserModel.findByPk(req.params.uuid)
	if (user) {
		res.status(200).send(user)
	} else {
		res.status(404).send('not found')
	}
}

export async function createOrUpdate(req, res) {
	if (!req.params && !req.params.uuid) {
		res.status(400).send('bad request')
		return;
	}
	const user = await UserModel.findByPk(req.params.uuid)
	if (user) {
		try {
			await UserModel.update(req.body, {where: {uuid: req.params.uuid}});
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
		if (!userYear) {
			UserYearModel.create({
				uuid: req.params.uuid,
				year: year.value,
				status: 1,
				editedBy: req.kauth.grant.access_token.content.sub})
		}
		else if (userYear.status == 0) {
			UserYearModel.update({status: 1, editedBy: req.kauth.grant.access_token.content.sub}, {
				where: {
					uuid: req.params.uuid,
					year: year.value
				}
			})
		}
		res.status(200).send(user)
	} else {
		var data = req.body
		data.uuid = req.params.uuid
		UserModel.create(data)
		res.status(200).send(user)
	}
}