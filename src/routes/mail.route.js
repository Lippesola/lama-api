import keycloak from '../config/keycloak.js'
import controller from '../controllers/mail.controller.js'
import createRouter from '../utils/createRouter.js'
import { requireAdmin, requireTeam } from '../middleware/auth.js'

export default createRouter({
	controller,
	methods: ['findAll', 'findOne'],
	auth: { read: [keycloak.protect(), requireAdmin] },
	// sendMail muss vor createOrUpdate (POST /:key) registriert werden
	extraRoutes: [
		{ method: 'post', path: '/sendMail', handler: controller.sendMail(), auth: keycloak.protect(), middleware: [requireTeam] },
		{ method: 'post', path: '/:key', handler: controller.createOrUpdate(), auth: [keycloak.protect(), requireAdmin] },
	],
})
