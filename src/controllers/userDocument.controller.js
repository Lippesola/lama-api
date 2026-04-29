import userDocumentModel from '../models/userDocument.model.js'
import settingModel from '../models/setting.model.js'
import userPermissionModel from '../models/userPermission.model.js'
import userModel from '../models/user.model.js'
import userYearModel from '../models/userYear.model.js'
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

// Standalone — wird intern ohne req/res aufgerufen
export async function deleteDocumentOnMissingYear(uuid) {
	const user = await userModel.findByPk(uuid);
	if (!user) return false;
	const lastYear = (await settingModel.findByPk('currentYear')).value - 1;
	const userDocument = await userDocumentModel.findByPk(uuid);
	if (userDocument && (userDocument.criminalRecord < lastYear || userDocument.selfCommitment < lastYear)) {
		const minYear = Math.min(userDocument.criminalRecord, userDocument.selfCommitment);
		for (let i = minYear + 1; i <= lastYear; i++) {
			const userYear = await userYearModel.findOne({ where: { uuid: uuid, year: i, status: 4 } });
			if (!userYear) {
				if (userDocument.criminalRecord < i) userDocument.criminalRecord = null;
				if (userDocument.selfCommitment < i) userDocument.selfCommitment = null;
				console.log(`User year ${i} does not exist for user ${uuid}, deleting document for this year.`);
			} else {
				console.log(`User year ${i} exists for user ${uuid}, skipping deletion for this year.`);
			}
			console.log(i);
		}
		await userDocument.save();
	}
}
