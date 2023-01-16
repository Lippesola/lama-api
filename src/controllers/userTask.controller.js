import UserTaskModel from '../models/userTask.model.js'
import keycloak from '../config/keycloak.js';

export async function findAll(req, res) {
	const userTask = await UserTaskModel.findAll({where: req.params})
	res.status(200).send(userTask)
}

export async function findOne(req, res) {
	if (!req.params && !req.params.uuid && !req.params.task) {
		res.status(400).send('bad request')
		return;
	}
	const userTask = await UserTaskModel.findOne({where: {uuid: req.params.uuid, task: req.params.task}})
	if (userTask) {
		res.status(200).send(userTask)
	} else {
		res.status(404).send('not found')
	}
}

export async function createOrUpdate(req, res) {
	if (!req.params && !req.params.uuid && !req.params.task) {
		res.status(400).send('bad request')
		return;
	}
	const userTask = await UserTaskModel.findOne({where: {uuid: req.params.uuid, task: req.params.task}})
	if (userTask) {
		UserTaskModel.update(req.body, {where: {uuid: req.params.uuid, task: req.params.task}});
		res.status(200).send(userTask)
	} else {
		var data = req.body
		data.uuid = req.params.uuid
		data.task = req.params.task
		UserTaskModel.create(data)
		res.status(200).send(userTask)
	}
}