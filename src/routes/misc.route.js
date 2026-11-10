import keycloak from '../config/keycloak.js'
import controller from '../controllers/misc.controller.js'
import createRouter from '../utils/createRouter.js'
import { requireAdmin } from '../middleware/auth.js'

export default createRouter({
	controller,
	methods: [],
	extraRoutes: [
		{ method: 'get', path: '/initUsers', handler: controller.initUsers(), auth: [keycloak.protect(), requireAdmin] },
		{ method: 'get', path: '/fillTeamMailinglist', handler: controller.fillTeamMailinglist(), auth: [keycloak.protect(), requireAdmin] },
	],
})
