import kcAdminClient from "../config/keycloak-cli.js";
import userYearModel from '../models/userYear.model.js'
import keycloak from '../config/keycloak.js';
import settingModel from "../models/setting.model.js";
import userModel from "../models/user.model.js";
import { addToTeamMailinglist, sendConfirmationMail } from "./mail.controller.js";

export async function findAll(req, res) {
	const year = req.query.year || await settingModel.findByPk('currentYear')
	const isLT = req.kauth.grant.access_token.content.groups.includes(year + '_LT')
	if (!isLT) {
		res.status(403).send()
		return;
	}
	let data = {}
	if (typeof req.query.userBundle !== 'undefined') {
		data['include'] = {
			model: userModel
		}
	}
	delete req.query.userBundle
	data['where'] = req.query
	try {
		const userYear = await userYearModel.findAll(data)
		res.status(200).send(userYear)
	} catch(e) {
		res.status(400).send()
	}
}

export async function findOne(req, res) {
	if (!req.params || !req.params.uuid || !req.params.year) {
		res.status(400).send('bad request')
		return;
	}
	const userYear = await userYearModel.findOne({where: {uuid: req.params.uuid, year: req.params.year}})
	if (userYear) {
		if (!userYear.build) userYear.build = 0;
		if (!userYear.cleanup) userYear.cleanup = 0;
		res.status(200).send(userYear)
	} else {
		res.status(404).send('not found')
	}
}

export async function createOrUpdate(req, res) {
	if (!req.params || !req.params.uuid || !req.params.year) {
		res.status(400).send('bad request')
		return;
	}
	const year = req.params.year || (await SettingModel.findByPk('currentYear')).value
	const isLT = req.kauth.grant.access_token.content.groups.includes(year + '_LT')
	const self = req.kauth.grant.access_token.content.sub === req.params.uuid
	if (!isLT && !self) {
		res.status(403).send()
		return;
	}
	const userYear = await userYearModel.findOne({where: {uuid: req.params.uuid, year: year}})
	var data = req.body
	if (userYear) {
		if (userYear.status === 2) {
			data['status'] = 3;
		}
		// activate user
		if (userYear.status !== 4 && req.body.status === 4) {
			if (!isLT) {
				res.status(403).send('Du musst im LT sein, um Leute freischalten zu können')
				return;
			}
			let groupId = '';
			(await kcAdminClient.groups.find()).forEach((group) => {
				if (group.name == 2023) {
					group.subGroups.forEach((subGroup) => {
						if (subGroup.name == (2023 + '_Team')) {
							groupId = subGroup.id
						}
					})
				}
			})
			kcAdminClient.users.addToGroup({
				id: req.params.uuid,
				groupId: groupId
			})
			.then(() => {})
			.catch((e) => {console.log(e);})
			
			addToTeamMailinglist(req.params.uuid, year);
			sendConfirmationMail(req.params.uuid);
		}
		userYearModel.update(data, {where: {uuid: req.params.uuid, year: req.params.year}});
		res.status(200).send(userYear)
	} else {
		res.status(400).send()
	}
}