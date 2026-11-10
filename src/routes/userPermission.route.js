import keycloak from '../config/keycloak.js'
import userPermissionModel from '../models/userPermission.model.js'
import BaseController from '../controllers/base.controller.js'
import createRouter from '../utils/createRouter.js'
import { requireAuth, isLT, requireTeam, requireSelfOrTeam } from '../middleware/auth.js'

const controller = new BaseController({ model: userPermissionModel, paramKey: ['uuid', 'permission'] })

export default createRouter({
	controller,
	methods: ['findAll', 'findOne', 'createOrUpdate'],
	middleware: {
		findAll: [requireTeam],
		findOne: [requireSelfOrTeam()],
		createOrUpdate: [requireAuth(isLT)],
	},
})
