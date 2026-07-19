import keycloak from '../config/keycloak.js'
import userCommentModel from '../models/userComment.model.js'
import BaseController from '../controllers/base.controller.js'
import createRouter from '../utils/createRouter.js'
import { requireAuth, isLT } from '../middleware/auth.js'

const controller = new BaseController({ model: userCommentModel, paramKey: 'uuid' })
const ltMiddleware = requireAuth(isLT)

export default createRouter({
	controller,
	methods: ['findAll', 'findOne', 'createOrUpdate'],
	middleware: {
		findAll: [ltMiddleware],
		findOne: [ltMiddleware],
		createOrUpdate: [ltMiddleware],
	},
})
