import keycloak from '../config/keycloak.js'
import controller from '../controllers/supporterYear.controller.js'
import createRouter from '../utils/createRouter.js'
import { isLT, requireAuth } from '../middleware/auth.js'

export default createRouter({
	controller,
	methods: ['findAll', 'findOne', 'create', 'update'],
	auth: {
		findAll: [keycloak.protect(), requireAuth(isLT)],
		findOne: [keycloak.protect(), requireAuth(isLT)],
		update:  [keycloak.protect(), requireAuth(isLT)],
		create:  null,
	},
})
