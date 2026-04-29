import keycloak from '../config/keycloak.js'
import preferenceModel from '../models/preference.model.js'
import BaseController from '../controllers/base.controller.js'
import createRouter from '../utils/createRouter.js'
import { requireAuth, isLTOrHasPermission } from '../middleware/auth.js'

const controller = new BaseController({ model: preferenceModel, paramKey: 'id' })
const allowedMw = requireAuth(req => isLTOrHasPermission(req, 'participator'))

export default createRouter({
	controller,
	methods: ['findAll', 'findOne', 'create', 'update', 'deleteOne'],
	middleware: {
		findAll: [allowedMw],
		findOne: [allowedMw],
		create: [allowedMw],
		update: [allowedMw],
		deleteOne: [allowedMw],
	},
})
