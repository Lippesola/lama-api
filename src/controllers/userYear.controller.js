import kcAdminClient from "../config/keycloak-cli.js";
import userYearModel from '../models/userYear.model.js'
import settingModel from "../models/setting.model.js";
import userModel from "../models/user.model.js";
import userDocumentModel from "../models/userDocument.model.js";
import userPermissionModel from "../models/userPermission.model.js";
import { addToTeamMailinglist, sendMailToUser } from "./mail.controller.js";
import { Op } from "sequelize";
import BaseController from './base.controller.js'
import { isLT, isSelf, selfOrLT, getTokenContent, isLTOrHasPermission } from '../middleware/auth.js'

class UserYearController extends BaseController {
	constructor() {
		super({ model: userYearModel, paramKey: ['uuid', 'year'] })
	}

	findAll() {
		return async (req, res) => {
			if (!isLT(req) && req.query.status !== '4') {
				res.status(403).send()
				return;
			}
			let data = {}
			data['include'] = []
			if (typeof req.query.userBundle !== 'undefined') {
				data['include'].push({ model: userModel, as: 'UserModel' })
				if (!isLT(req)) {
					let attributes = [];
					for (const key in userModel.rawAttributes) {
						if (userModel.rawAttributes[key]['public']) attributes.push(key)
					};
					if (attributes.length > 0) data['include'][0]['attributes'] = attributes
				}
			}
			if (typeof req.query.assigneeBundle !== 'undefined') {
				data['include'].push({ model: userModel, as: 'AssigneeModel' })
			}
			if (await isLTOrHasPermission(req, 'userDocument')) {
				if (typeof req.query.documentBundle !== 'undefined') {
					userYearModel.belongsTo(userDocumentModel, { foreignKey: 'uuid', targetKey: 'uuid' })
					data['include'].push({ model: userDocumentModel })
				}
			}
			data['where'] = req.query
			delete data.where.userBundle
			delete data.where.assigneeBundle
			delete data.where.documentBundle
			try {
				console.log(data);
				const userYear = await userYearModel.findAll(data)
				res.status(200).send(userYear)
			} catch(e) {
				console.log(e);
				res.status(400).send()
			}
		}
	}

	findOne() {
		return async (req, res) => {
			if (!req.params || !req.params.uuid || !req.params.year) {
				res.status(400).send('bad request')
				return;
			}
			const userYear = await userYearModel.findOne({ where: { uuid: req.params.uuid, year: req.params.year } })
			if (userYear) {
				if (!userYear.build) userYear.build = 0;
				if (!userYear.cleanup) userYear.cleanup = 0;
				res.status(200).send(userYear)
			} else {
				res.status(404).send('not found')
			}
		}
	}

	createOrUpdate() {
		return async (req, res) => {
			if (!req.params || !req.params.uuid || !req.params.year) {
				res.status(400).send('bad request')
				return;
			}
			const year = req.params.year || (await settingModel.findByPk('currentYear')).value
			if (selfOrLT(req)) {
				res.status(403).send()
				return;
			}
			const userYear = await userYearModel.findOne({ where: { uuid: req.params.uuid, year: year } })
			req.body.registeredAt = userYear.registeredAt;
			var data = req.body
			if (userYear) {
				if (userYear.status === 2) {
					data['status'] = 3;
					data['registeredAt'] = new Date();
				}
				// activate user
				if (userYear.status !== 4 && req.body.status === 4) {
					if (!isLT(req)) {
						res.status(403).send('Du musst im LT sein, um Leute freischalten zu können')
						return;
					}
					(await kcAdminClient.groups.find()).forEach(async (group) => {
						if (group.name == year) {
							(await kcAdminClient.groups.listSubGroups({ parentId: group.id })).forEach((subGroup) => {
								if (subGroup.name == (year + '_Team')) {
									kcAdminClient.users.addToGroup({ id: req.params.uuid, groupId: subGroup.id })
									.then(() => {})
									.catch((e) => { console.log(e); })
								}
							})
						}
					})
					addToTeamMailinglist(req.params.uuid, year);
					sendMailToUser(req.params.uuid, 'confirmation');
				}
				userYearModel.update(data, { where: { uuid: req.params.uuid, year: req.params.year } });
				res.status(200).send(userYear)
			} else {
				res.status(400).send()
			}
		}
	}

	additionalInfo() {
		return async (req, res) => {
			const uuid = req.params.uuid || getTokenContent(req).sub
			let isLeader = false;
			await kcAdminClient.users.listGroups({ id: uuid }).then((groups) => {
				groups.forEach((group) => {
					if (group.name === 'Leitungsteam') {
						isLeader = true;
						return
					}
				})
			});
			const userYear = await userYearModel.findAll({
				where: {
					uuid: req.params.uuid,
					status: 4,
					year: { [Op.ne]: (await settingModel.findByPk('currentYear')).value }
				}
			})
			console.log(userYear);
			const isNew = !userYear.length;
			res.status(200).send({ isLeader: isLeader, isNew: isNew });
		}
	}
}

export default new UserYearController()
