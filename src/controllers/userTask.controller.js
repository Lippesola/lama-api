import userTaskModel from '../models/userTask.model.js'
import keycloak from '../config/keycloak.js';

export async function findAll(req, res) {
	try {
		const userTask = await userTaskModel.findAll({where: req.query})
		res.status(200).send(userTask)
	} catch(e) {
		res.status(400).send()
	}
}

export async function findOne(req, res) {
	if (!req.params || !req.params.uuid || !req.params.task) {
		res.status(400).send('bad request')
		return;
	}
	const userTask = await userTaskModel.findOne({where: {uuid: req.params.uuid, task: req.params.task}})
	if (userTask) {
		res.status(200).send(userTask)
	} else {
		res.status(404).send('not found')
	}
}

export async function createOrUpdate(req, res) {
	if (!req.params || !req.params.uuid || !req.params.task) {
		res.status(400).send('bad request')
		return;
	}
	const userTask = await userTaskModel.findOne({where: {uuid: req.params.uuid, task: req.params.task}})
	if (userTask) {
		userTaskModel.update(req.body, {where: {uuid: req.params.uuid, task: req.params.task}});
		res.status(200).send(userTask)
	} else {
		var data = req.body
		data.uuid = req.params.uuid
		data.task = req.params.task
		userTaskModel.create(data)
		res.status(200).send(userTask)
	}
}