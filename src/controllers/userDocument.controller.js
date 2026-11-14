import userDocumentModel from '../models/userDocument.model.js'
import BaseController from './base.controller.js'
import { isSelf, isLTOrHasPermission } from '../middleware/auth.js'

const documentTypes = [
	'criminalRecord',
	'selfCommitment',
	'privacyCommitment',
	'parentalConsent'
]

class UserDocumentController extends BaseController {
	constructor() {
		super({ model: userDocumentModel, paramKey: 'uuid' })
	}

	findAll() {
		return async (req, res) => {
			if (!await isLTOrHasPermission(req, 'userDocument')) {
				res.status(403).send()
				return;
			}
			try {
				const userDocument = await userDocumentModel.findAll({ where: req.query })
				res.status(200).send(userDocument)
			} catch(e) {
				res.status(400).send()
			}
		}
	}

	findOne() {
		return async (req, res) => {
			if (!req.params || !req.params.uuid) {
				res.status(400).send('bad request')
				return;
			}
			const self = isSelf(req, 'uuid')
			if (!self && !await isLTOrHasPermission(req, 'userDocument')) {
				res.status(403).send()
				return;
			}
			const userDocument = await userDocumentModel.findOne({ where: { uuid: req.params.uuid } })
			if (userDocument) {
				res.status(200).send(userDocument)
			} else {
				res.status(404).send('not found')
			}
		}
	}

	createOrUpdate() {
		return async (req, res) => {
			if (!await isLTOrHasPermission(req, 'userDocument')) {
				res.status(403).send()
				return;
			}
			if (!req.params?.uuid || !documentTypes.some(type => req.body[type])) {
				res.status(400).send('bad request')
				return;
			}
			const userDocument = await userDocumentModel.findOne({ where: { uuid: req.params.uuid } })
			if (userDocument) {
				await userDocumentModel.update(req.body, { where: { uuid: req.params.uuid } })
				res.status(200).send(userDocument)
			} else {
				const data = { ...req.body, uuid: req.params.uuid }
				const created = await userDocumentModel.create(data)
				res.status(200).send(created)
			}
		}
	}
}

export default new UserDocumentController()
