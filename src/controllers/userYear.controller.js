import kcAdminClient from "../config/keycloak-cli.js";
import userYearModel from '../models/userYear.model.js'
import keycloak from '../config/keycloak.js';
import settingModel from "../models/setting.model.js";
import userModel from "../models/user.model.js";
import userDocumentModel from "../models/userDocument.model.js";
import userPermissionModel from "../models/userPermission.model.js";
import { addToTeamMailinglist, sendMailToUser } from "./mail.controller.js";
import { Op } from "sequelize";

export async function findAll(req, res) {
	const year = req.query.year || (await settingModel.findByPk('currentYear')).value
	const isLT = req.kauth.grant.access_token.content.groups?.includes(year + '_LT')
	const permissions = await userPermissionModel.findAll({where: {uuid: req.kauth.grant.access_token.content.sub}})
	if (!isLT && req.query.status !== '4') {
		res.status(403).send()
		return;
	}
	let data = {}
	data['include'] = []
	if (typeof req.query.userBundle !== 'undefined') {
		data['include'].push({
			model: userModel,
			as: 'UserModel'
		})
		if (!isLT) {
			let attributes = [];
			for (const key in userModel.rawAttributes) {
				if (userModel.rawAttributes[key]['public']) {
					attributes.push(key)
				}
			};
			if (attributes.length > 0) {
				data['include'][0]['attributes'] = attributes
			}
		}
	}
	if (typeof req.query.assigneeBundle !== 'undefined') {
		data['include'].push({
			model: userModel,
			as: 'AssigneeModel'
		})
	}
	
	if (isLT || permissions.find(permission => permission.permission === 'userDocument')?.allowed) {
		if (typeof req.query.documentBundle !== 'undefined') {
			userYearModel.belongsTo(userDocumentModel, {foreignKey: 'uuid', targetKey: 'uuid'})
			data['include'].push({
				model: userDocumentModel
			})
		}
	}
	delete req.query.userBundle
	delete req.query.assigneeBundle
	delete req.query.documentBundle
	data['where'] = req.query
	try {
		console.log(data);
		const userYear = await userYearModel.findAll(data)
		res.status(200).send(userYear)
	} catch(e) {
		console.log(e);
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
	const isLT = req.kauth.grant.access_token.content.groups?.includes(year + '_LT')
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
			(await kcAdminClient.groups.find()).forEach(async (group) => {
				if (group.name == year) {
					(await kcAdminClient.groups.listSubGroups({parentId: group.id})).forEach((subGroup) => {
						if (subGroup.name == (year + '_Team')) {
							kcAdminClient.users.addToGroup({
								id: req.params.uuid,
								groupId: subGroup.id
							})
							.then(() => {})
							.catch((e) => {console.log(e);})
						}
					})
				}
			})
			
			addToTeamMailinglist(req.params.uuid, year);
			sendMailToUser(req.params.uuid, 'confirmation');
		}
		userYearModel.update(data, {where: {uuid: req.params.uuid, year: req.params.year}});
		res.status(200).send(userYear)
	} else {
		res.status(400).send()
	}
}

export async function additionalInfo(req, res) {
	const uuid = req.params.uuid || req.kauth.grant.access_token.content.sub
	const year = req.params.year || (await settingModel.findByPk('currentYear')).value
	let isLeader = false;
	await kcAdminClient.users.listGroups({id: uuid}).then((groups) => {
		groups.forEach((group) => {
			if (group.name === year + '_LT') {
				isLeader = true;
				return
			}
		})
	});
	const userYear = await userYearModel.findAll({
		where: {
			uuid: req.params.uuid,
			status: 4,
			year: {
				[Op.ne]: (await settingModel.findByPk('currentYear')).value
			}
		}
	})
	console.log(userYear);
	const isNew = !userYear.length;
	res.status(200).send({
		isLeader: isLeader,
		isNew: isNew
	});
}