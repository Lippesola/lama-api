import userModel from '../models/user.model.js'
import userYearModel from '../models/userYear.model.js'
import settingModel from '../models/setting.model.js'
import keycloak from '../config/keycloak.js';
import { ValidationError } from 'sequelize';

export async function findAll(req, res) {
	const year = req.query.year || (await settingModel.findByPk('currentYear')).value
	const isTeam = req.kauth.grant.access_token.content.groups.includes(year + '_Team')
	const isLT = req.kauth.grant.access_token.content.groups.includes(year + '_LT')
	let findAllConfig = {}
	let userWhere = req.query
	let userYearWhere = {}
	let attributes = []
	delete userWhere.year
	userYearWhere['year'] = year
	userYearWhere['status'] = 4
	if (!isTeam) {
		res.status(403).send()
		return
	}
	if (!isLT) {
		Object.entries(userModel.rawAttributes).forEach(([key, value]) => {
			if (value.public) {
				attributes.push(value.field);
			} else {
				delete userWhere[value.field]
			}
		})
		userYearWhere['status'] = 4
	}

	if (attributes.length > 0) {
		findAllConfig['attributes'] = attributes
	}
	findAllConfig['include'] = {
		attributes: [],
		model: userYearModel,
		where: userYearWhere
	}
	findAllConfig['where'] = userWhere

	try {
		const user = await userModel.findAll(findAllConfig)
		res.status(200).send(user)
	} catch(e) {
		res.status(400).send()
	}
}

export async function findOne(req, res) {
	if (!req.params || !req.params.uuid) {
		res.status(400).send('bad request')
		return;
	}
	const year = (await settingModel.findByPk('currentYear')).value
	const isTeam = req.kauth.grant.access_token.content.groups.includes(year + '_Team')
	const isLT = req.kauth.grant.access_token.content.groups.includes(year + '_LT')
	const self = req.kauth.grant.access_token.content.sub === req.params.uuid
	let attributes = []
	if (!isTeam && !self) {
		res.status(403).send()
		return
	}
	if (!isLT && !self) {
		Object.entries(userModel.rawAttributes).forEach(([key, value]) => {
			if (value.public) {
				attributes.push(value.field);
			}
		})
	}

	let findByPkConfig = {}
	if (attributes.length > 0) {
		findByPkConfig['attributes'] = attributes
	}
	const user = await userModel.findByPk(req.params.uuid, findByPkConfig)
	if (user) {
		res.status(200).send(user)
	} else {
		res.status(404).send('not found')
	}
}

export async function createOrUpdate(req, res) {
	if (!req.params || !req.params.uuid) {
		res.status(400).send('bad request')
		return;
	}
	const self = req.kauth.grant.access_token.content.sub === req.params.uuid
	if (!self) {
		res.status(403).send()
		return;
	}
	const user = await userModel.findByPk(req.params.uuid)
	if (user) {
		try {
			await userModel.update(req.body, {where: {uuid: req.params.uuid}});
		} catch(e) {
			if (e instanceof ValidationError) {
				let returnErrors = []
				e.errors.forEach((error) => {
					returnErrors.push(error.path)
					console.log(error.path, error.validatorKey);
				})
				res.status(400).send(returnErrors)
			}
			res.status(500).send()
			return
		}
		const year = (await settingModel.findByPk('currentYear')).value
		const userYear = await userYearModel.findOne({
			where: {
				uuid: req.params.uuid,
				year: year
			}
		})
		if (!userYear) {
			userYearModel.create({
				uuid: req.params.uuid,
				year: year,
				status: 1,
				editedBy: req.kauth.grant.access_token.content.sub})
		}
		else if (userYear.status == 0) {
			userYearModel.update({status: 1, editedBy: req.kauth.grant.access_token.content.sub}, {
				where: {
					uuid: req.params.uuid,
					year: year
				}
			})
		}
		res.status(200).send(user)
	} else {
		var data = req.body
		data.uuid = req.params.uuid
		userModel.create(data)
		res.status(200).send(user)
	}
}