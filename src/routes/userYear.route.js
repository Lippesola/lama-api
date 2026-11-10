import keycloak from '../config/keycloak.js'
import controller from '../controllers/userYear.controller.js'
import createRouter from '../utils/createRouter.js'
import { requireTeam, requireSelfOrTeam } from '../middleware/auth.js'

export default createRouter({
	controller,
	methods: ['findAll', 'findOne', 'createOrUpdate'],
	middleware: {
		findAll: [requireTeam],
		findOne: [requireSelfOrTeam()],
	},
	extraRoutes: [
		{ method: 'get', path: '/additionalInfo/:uuid', handler: controller.additionalInfo() },
	],
})
