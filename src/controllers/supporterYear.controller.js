import kcAdminClient from "../config/keycloak-cli.js";
import supporterYearModel from '../models/supporterYear.model.js'
import keycloak from '../config/keycloak.js';
import settingModel from "../models/setting.model.js";
import supporterDayModel from "../models/supporterDay.model.js";
import { ValidationError } from 'sequelize';

export async function findAll(req, res) {
	const year = req.query.year || (await settingModel.findByPk('currentYear')).value
	const isLT = req.kauth.grant.access_token.content.groups.includes(year + '_LT')
	if (!isLT) {
		res.status(403).send()
		return;
	}
	let data = {}
	data['include'] = {
		model: supporterDayModel
	}
	data['where'] = req.query
	try {
		const supporterYear = await supporterYearModel.findAll(data)
		res.status(200).send(supporterYear)
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
	const isLT = req.kauth.grant.access_token.content.groups.includes(year + '_LT')
	if (!isLT) {
		res.status(403).send()
		return;
	}
	const supporterYear = await supporterYearModel.findOne({where: {uuid: req.params.uuid}})
	if (supporterYear) {
		res.status(200).send(supporterYear)
	} else {
		res.status(404).send('not found')
	}
}

export async function create(req, res) {
	const year = (await settingModel.findByPk('currentYear')).value
	var data = req.body
	data.year = year
	try {
		const supporterYear = await supporterYearModel.create(data)
		req.body.days.forEach(async (day) => {
			await supporterDayModel.create({
				uuid: supporterYear.uuid,
				day: day,
				status: 1
			})
		})
		res.status(200).send()
	} catch(e) {
		if (e instanceof ValidationError) {
			let returnErrors = []
			e.errors.forEach((error) => {
				returnErrors.push(error.path)
				console.log(error.path, error.validatorKey);
			})
			res.status(400).send(returnErrors)
		}
		console.log(e)
		res.status(500).send()
	}
}

export async function update(req, res) {
	const year = (await settingModel.findByPk('currentYear')).value
	const isLT = req.kauth.grant.access_token.content.groups.includes(year + '_LT')

	if (!isLT) {
		res.status(403).send()
		return;
	}
	try {
		await supporterYearModel.update(data, {where: {uuid: req.params.uuid}});
		res.status(200).send()
	} catch(e) {
		if (e instanceof ValidationError) {
			let returnErrors = []
			e.errors.forEach((error) => {
				returnErrors.push(error.path)
				console.log(error.path, error.validatorKey);
			})
			res.status(400).send(returnErrors)
		}
		console.log(e)
		res.status(500).send()
	}
}