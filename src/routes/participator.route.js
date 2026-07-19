import keycloak from '../config/keycloak.js'
import controller from '../controllers/participator.controller.js'
import createRouter from '../utils/createRouter.js'
import { requireAuth, isLTOrHasPermission } from '../middleware/auth.js'

const allowedMw = requireAuth(req => isLTOrHasPermission(req, 'participator'))

export default createRouter({
	controller,
	methods: ['findAll', 'findOne', 'createOrUpdate'],
	extraRoutes: [
		{ method: 'post', path: '/:orderId/:positionId/details', handler: controller.updateDetails(), middleware: [allowedMw] },
	],
})
