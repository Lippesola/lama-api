import keycloak from '../config/keycloak.js'
import controller from '../controllers/admin.controller.js'
import createRouter from '../utils/createRouter.js'
import { requireAdmin } from '../middleware/auth.js'

const auth = [keycloak.protect(), requireAdmin]

export default createRouter({
	controller,
	methods: [],
	extraRoutes: [
		{ method: 'get', path: '/yearChange', handler: controller.yearChangePreview(), auth },
		{ method: 'post', path: '/yearChange', handler: controller.yearChange(), auth },
	],
})
