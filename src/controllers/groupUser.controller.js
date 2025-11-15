import groupUserModel from '../models/groupUser.model.js'
import userPermissionModel from '../models/userPermission.model.js';
import settingModel from '../models/setting.model.js'

async function isAllowed(req) {
	const executingUser = req.kauth.grant.access_token.content.sub
	const isLT = req.kauth.grant.access_token.content.groups?.includes('Leitungsteam')
	const allowed = isLT || (await userPermissionModel.findOne({where: { uuid: executingUser, permission: 'participator'}}))?.allowed
	return allowed
}

export async function findAll(req, res) {
	if (res && !await isAllowed(req)) {
		res.status(403).send('Not allowed');
		return;
	}
	try {
		const groupUser = await groupUserModel.findAll({where: req.query})
		res.status(200).send(groupUser)
	} catch(e) {
		res.status(400).send()
	}
}

export async function findOne(req, res) {
	if (res && !await isAllowed(req)) {
		res.status(403).send('Not allowed');
		return;
	}
	if (!req.params || !req.params.groupId || !req.params.uuid) {
		res.status(400).send('bad request')
		return;
	}
	const groupUser = await groupUserModel.findOne({where: {group: req.params.groupId, uuid: uuid}})
	if (groupUser) {
		res.status(200).send(groupUser)
	} else {
		res.status(404).send('not found')
	}
}

export async function createOrUpdate(req, res) {
	if (res && !await isAllowed(req)) {
		res.status(403).send('Not allowed');
		return;
	}
	if (!req.params || !req.params.group || !req.params.uuid ) {
		res.status(400).send('bad request')
		return;
	}
	const groupUser = await groupUserModel.findOne({where: {groupId: req.params.group, uuid: req.params.uuid}})
	if (groupUser) {
		groupUser.update(req.body);
		res.status(200).send(groupUser)
	} else {
		var data = req.body
		data.groupId = req.params.group
		data.uuid = req.params.uuid
		groupUserModel.create(data)
		res.status(200).send(groupUser)
	}
}

export async function deleteOne(req, res) {
	if (res && !await isAllowed(req)) {
		res.status(403).send('Not allowed');
		return;
	}
	if (!req.params || !req.params.group || !req.params.uuid ) {
		res.status(400).send('bad request')
		return;
	}
	const groupUser = await groupUserModel.findOne({where: {groupId: req.params.group, uuid: req.params.uuid}})
	if (groupUser) {
		groupUserModel.destroy({where: {groupId: req.params.group, uuid: req.params.uuid}});
		res.status(200).send(groupUser)
	} else {
		res.status(404).send('not found')
	}
}