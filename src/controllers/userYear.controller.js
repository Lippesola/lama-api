import kcAdminClient from "../config/keycloak-cli.js";
import UserYearModel from '../models/userYear.model.js'
import keycloak from '../config/keycloak.js';

export async function findAll(req, res) {
	const userYear = await UserYearModel.findAll({where: req.query})
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
	console.log(req.kauth.grant.access_token.content);
	if (userYear) {
		if (req.body.status === 4) {
			let isLT = false;
			console.log('ASDF');
			(await kcAdminClient.users.listGroups({id: req.params.uuid})).forEach((group) => {
				console.log(group.name);
				console.log(req.params.year + '_LT');
				if (group.name === req.params.year + '_LT') {
					isLT = true
				}
			})
			console.log('ASDF');
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
			UserYearModel.update(data, {where: {uuid: req.params.uuid, year: req.params.year}});
		}
		res.status(200).send(userYear)
	} else {
		data.uuid = req.params.uuid
		data.year = req.params.year
		UserYearModel.create(data)
		res.status(200).send(userYear)
	}
}