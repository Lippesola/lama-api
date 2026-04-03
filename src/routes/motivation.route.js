import keycloak from '../config/keycloak.js'
import controller from '../controllers/motivation.controller.js'
import createRouter from '../utils/createRouter.js'

export default createRouter({
	controller,
	methods: ['findAll', 'findOne'],
	extraRoutes: [
		{ method: 'post', path: '/', handler: controller.replaceAll() },
	],
})
