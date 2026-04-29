import keycloak from '../config/keycloak.js'
import controller from '../controllers/misc.controller.js'
import createRouter from '../utils/createRouter.js'

export default createRouter({
	controller,
	methods: [],
	extraRoutes: [
		{ method: 'get', path: '/initUsers', handler: controller.initUsers(), auth: keycloak.protect(['admin']) },
		{ method: 'get', path: '/fillTeamMailinglist', handler: controller.fillTeamMailinglist(), auth: keycloak.protect(['admin']) },
	],
})
