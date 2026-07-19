import keycloak from '../config/keycloak.js'
import participatorQuestionModel from '../models/participatorQuestion.model.js'
import BaseController from '../controllers/base.controller.js'
import createRouter from '../utils/createRouter.js'

const controller = new BaseController({ model: participatorQuestionModel, paramKey: 'id' })

export default createRouter({
	controller,
	methods: ['findAll', 'findOne', 'createOrUpdate'],
	auth: { write: keycloak.protect(['admin']) },
})
