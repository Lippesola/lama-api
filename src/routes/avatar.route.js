import keycloak from '../config/keycloak.js'
import controller from '../controllers/avatar.controller.js'
import createRouter from '../utils/createRouter.js'
import { requireSelfOrTeam } from '../middleware/auth.js'

export default createRouter({
	controller,
	methods: [],
	extraRoutes: [
		{ method: 'get', path: '/:uuid', handler: controller.findOne(), middleware: [requireSelfOrTeam()] },
		{ method: 'post', path: '/:uuid', handler: controller.createOrUpdate() },
	],
})
