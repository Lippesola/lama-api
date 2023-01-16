import SettingModel from '../models/setting.model.js'
import keycloak from '../config/keycloak.js';

export async function findAll(req, res) {
	const setting = await SettingModel.findAll({where: req.params})
	res.status(200).send(setting)
}

export async function findOne(req, res) {
	if (!req.params && !req.params.key) {
		res.status(400).send('bad request')
		return;
	}
	const setting = await SettingModel.findByPk(req.params.key)
	if (setting) {
		res.status(200).send(setting)
	} else {
		res.status(404).send('not found')
	}
}

export async function createOrUpdate(req, res) {
	if (!req.params && !req.params.key) {
		res.status(400).send('bad request')
		return;
	}
	const setting = await SettingModel.findByPk(req.params.key)
	if (setting) {
		SettingModel.update(req.body, {where: {key: req.params.key}});
		res.status(200).send(setting)
	} else {
		var data = req.body
		data.key = req.params.key
		SettingModel.create(data)
		res.status(200).send(setting)
	}
}