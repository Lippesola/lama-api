import keycloak from '../config/keycloak.js'
import controller from '../controllers/participator.controller.js'
import createRouter from '../utils/createRouter.js'

export default createRouter({
	controller,
	methods: ['findAll', 'findOne', 'createOrUpdate'],
})
