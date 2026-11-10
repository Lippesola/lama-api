import keycloak from '../config/keycloak.js'
import controller from '../controllers/post.controller.js'
import createRouter from '../utils/createRouter.js'
import { requireTeam } from '../middleware/auth.js'

export default createRouter({
	controller,
	methods: ['findAll', 'findOne', 'create', 'update', 'deleteOne'],
	middleware: {
		findAll: [requireTeam],
		findOne: [requireTeam],
		create: [requireTeam],
		update: [requireTeam],
		deleteOne: [requireTeam],
	},
})
