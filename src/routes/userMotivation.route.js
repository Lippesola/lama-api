import keycloak from '../config/keycloak.js'
import controller from '../controllers/userMotivation.controller.js'
import createRouter from '../utils/createRouter.js'
import { requireAuth, selfOrLT } from '../middleware/auth.js'

export default createRouter({
	controller,
	methods: ['findOne', 'createOrUpdate'],
	middleware: {
		findOne: [requireAuth(req => selfOrLT(req, 'uuid'))],
	},
})
