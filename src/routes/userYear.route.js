import keycloak from '../config/keycloak.js'
import controller from '../controllers/userYear.controller.js'
import createRouter from '../utils/createRouter.js'

export default createRouter({
	controller,
	methods: ['findAll', 'findOne', 'createOrUpdate'],
	extraRoutes: [
		{ method: 'get', path: '/additionalInfo/:uuid', handler: controller.additionalInfo() },
	],
})
