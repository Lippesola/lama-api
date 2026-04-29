import keycloak from '../config/keycloak.js'
import controller from '../controllers/supporterYear.controller.js'
import createRouter from '../utils/createRouter.js'

export default createRouter({
	controller,
	methods: ['findAll', 'findOne', 'update'],
})
