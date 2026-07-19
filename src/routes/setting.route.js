import keycloak from '../config/keycloak.js'
import settingModel from '../models/setting.model.js'
import BaseController from '../controllers/base.controller.js'
import createRouter from '../utils/createRouter.js'

export const controller = new BaseController({ model: settingModel, paramKey: 'key' })

export default createRouter({
	controller,
	methods: ['findOne', 'createOrUpdate'],
	auth: { write: keycloak.protect(['admin']) },
})
