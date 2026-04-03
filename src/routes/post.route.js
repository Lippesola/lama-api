import keycloak from '../config/keycloak.js'
import controller from '../controllers/post.controller.js'
import createRouter from '../utils/createRouter.js'

export default createRouter({
	controller,
	methods: ['findAll', 'findOne', 'create', 'update', 'deleteOne'],
})
