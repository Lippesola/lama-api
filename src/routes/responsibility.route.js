import keycloak from '../config/keycloak.js'
import responsibilityModel from '../models/responsibility.model.js'
import BaseController from '../controllers/base.controller.js'
import createRouter from '../utils/createRouter.js'

const controller = new BaseController({ model: responsibilityModel, paramKey: 'id' })

export default createRouter({
	controller,
	methods: ['findAll', 'findOne', 'create', 'update'],
	auth: { write: keycloak.protect(['admin']) },
})
