import preferenceModel from '../models/preference.model.js'
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
		const preference = await preferenceModel.findAll({where: req.query})
		res.status(200).send(preference)
	} catch(e) {
		console.log(e);
		res.status(400).send()
	}
}

export async function findOne(req, res) {
	if (res && !await isAllowed(req)) {
		res.status(403).send('Not allowed');
		return;
	}
	if (!req.params || !req.params.id) {
		res.status(400).send('bad request')
		return;
	}
	const preference = await preferenceModel.findByPk(req.params.id)
	if (preference) {
		res.status(200).send(preference)
	} else {
		res.status(404).send('not found')
	}
}

export async function create(req, res) {
	if (res && !await isAllowed(req)) {
		res.status(403).send('Not allowed');
		return;
	}
	if (!req.params || !req.body.groupId) {
		res.status(400).send('bad request')
		return;
	}
	let preference = await preferenceModel.create(req.body)
	res.status(200).send(preference)
}

export async function update(req, res) {
	if (res && !await isAllowed(req)) {
		res.status(403).send('Not allowed');
		return;
	}
	if (!req.params || !req.params.id) {
		res.status(400).send('bad request')
		return;
	}
	const preference = await preferenceModel.findByPk(req.params.id)
	if (preference) {
		await preferenceModel.update(req.body, {where: {id: req.params.id}});
		res.status(200).send(preference)
	} else {
		res.status(404).send('not found')
	}
}

export async function deleteOne(req, res) {
	if (res && !await isAllowed(req)) {
		res.status(403).send('Not allowed');
		return;
	}
	if (!req.params || !req.params.id) {
		res.status(400).send('bad request')
		return;
	}
	const preference = await preferenceModel.findByPk(req.params.id)
	if (preference) {
		preferenceModel.destroy({where: {id: req.params.id}});
		res.status(200).send(preference)
	} else {
		res.status(404).send('not found')
	}
}