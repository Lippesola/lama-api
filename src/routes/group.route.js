import keycloak from '../config/keycloak.js'
import controller from '../controllers/group.controller.js'
import createRouter from '../utils/createRouter.js'
import { requireAuth, isLTOrHasPermission } from '../middleware/auth.js'

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
	extraRoutes: [
		{ method: 'post', path: '/autoSort/:year/:week', handler: controller.autoSort(), middleware: [allowedMw] },
	],
})
