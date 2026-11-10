import keycloak from '../config/keycloak.js'
import controller from '../controllers/userCriminalRecord.controller.js'
import createRouter from '../utils/createRouter.js'
import { requireAuth, selfOrLT } from '../middleware/auth.js'

export default createRouter({
	controller,
	methods: [],
	extraRoutes: [
		{ method: 'get', path: '/:uuid', handler: controller.findOne(), middleware: [requireAuth(req => selfOrLT(req))] },
	],
})
