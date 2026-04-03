import keycloak from '../config/keycloak.js'
import mailController from '../controllers/mail.controller.js'
import createRouter from '../utils/createRouter.js'

export default createRouter({
	controller: mailController,
	methods: [],
	extraRoutes: [
		{ method: 'get', path: '/', handler: mailController.findAllMailinglists() },
	],
})
