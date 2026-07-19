import keycloak from '../config/keycloak.js'
import eventModel from '../models/event.model.js'
import BaseController from '../controllers/base.controller.js'
import createRouter from '../utils/createRouter.js'

export const controller = new BaseController({ model: eventModel, paramKey: 'id' })

export default createRouter({
	controller,
	methods: ['findOne', 'createOrUpdate'],
	auth: { write: keycloak.protect(['admin']) },
})
