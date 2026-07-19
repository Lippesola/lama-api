import keycloak from '../config/keycloak.js'
import featureModel from '../models/feature.model.js'
import BaseController from '../controllers/base.controller.js'
import createRouter from '../utils/createRouter.js'

const controller = new BaseController({ model: featureModel, paramKey: 'id' })

export default createRouter({
	controller,
	methods: ['findAll', 'findOne', 'create', 'update'],
	auth: { read: null, write: keycloak.protect(['admin']) },
})
