import keycloak from '../config/keycloak.js'
import groupUserModel from '../models/groupUser.model.js'
import BaseController from '../controllers/base.controller.js'
import createRouter from '../utils/createRouter.js'
import { requireAuth, isLTOrHasPermission } from '../middleware/auth.js'

const controller = new BaseController({
	model: groupUserModel,
	paramKey: ['group', 'uuid'],
	paramToField: { group: 'groupId' },
})
const allowedMw = requireAuth(req => isLTOrHasPermission(req, 'participator'))

export default createRouter({
	controller,
	methods: ['findAll', 'findOne', 'createOrUpdate', 'deleteOne'],
	middleware: {
		findAll: [allowedMw],
		findOne: [allowedMw],
		createOrUpdate: [allowedMw],
		deleteOne: [allowedMw],
	},
})
