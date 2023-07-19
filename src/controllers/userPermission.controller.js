import userPermissionModel from '../models/userPermission.model.js'
import settingModel from '../models/setting.model.js'

export async function findAll(req, res) {
	try {
		const userPermission = await userPermissionModel.findAll({where: req.query})
		res.status(200).send(userPermission)
	} catch(e) {
		res.status(400).send()
	}
}

export async function findOne(req, res) {
	if (!req.params || !req.params.uuid || !req.params.permission ) {
		res.status(400).send('bad request')
		return;
	}
	const userPermission = await userPermissionModel.findOne({where: {permission: req.params.permission, uuid: req.params.uuid}})
	if (userPermission) {
		res.status(200).send(userPermission)
	} else {
		res.status(404).send('not found')
	}
}

export async function createOrUpdate(req, res) {
	const year = (await settingModel.findByPk('currentYear')).value
	const isLT = req.kauth.grant.access_token.content.groups.includes(year + '_LT')
	if (!isLT) {
		res.status(403).send()
		return;
	}
	if (!req.params || !req.params.uuid || !req.params.permission ) {
		res.status(400).send('bad request')
		return;
	}
	const userPermission = await userPermissionModel.findOne({where: {permission: req.params.permission, uuid: req.params.uuid}})
	if (userPermission) {
		userPermissionModel.update(req.body);
		res.status(200).send(userPermission)
	} else {
		var data = req.body
		data.permission = req.params.permission
		data.uuid = req.params.uuid
		userPermissionModel.create(data)
		res.status(200).send(userPermission)
	}
}