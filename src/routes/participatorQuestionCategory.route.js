import keycloak from '../config/keycloak.js'
import participatorQuestionCategoryModel from '../models/participatorQuestionCategory.model.js'
import BaseController from '../controllers/base.controller.js'
import createRouter from '../utils/createRouter.js'

const controller = new BaseController({ model: participatorQuestionCategoryModel, paramKey: 'id' })

export default createRouter({
	controller,
	methods: ['findAll', 'findOne', 'createOrUpdate'],
	auth: { write: keycloak.protect(['admin']) },
})
