import UserModel from '../models/user.model.js'
import keycloak from '../config/keycloak.js';

export async function findAll(req, res) {
	const user = await UserModel.findAll({where: req.params})
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
		UserModel.update(req.body, {where: {uuid: req.params.uuid}});
		res.status(200).send(user)
	} else {
		var data = req.body
		data.uuid = req.params.uuid
		UserModel.create(data)
		res.status(200).send(user)
	}
}