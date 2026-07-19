import keycloak from '../config/keycloak.js'
import userPostModel from '../models/userPost.model.js'
import BaseController from '../controllers/base.controller.js'
import createRouter from '../utils/createRouter.js'
import { requireAuth, isSelf } from '../middleware/auth.js'

const controller = new BaseController({
	model: userPostModel,
	paramKey: ['uuid', 'post'],
	paramToField: { post: 'postId' },
})

export default createRouter({
	controller,
	methods: ['findAll', 'findOne', 'createOrUpdate'],
	middleware: {
		createOrUpdate: [requireAuth(req => isSelf(req, 'uuid'))],
	},
})
