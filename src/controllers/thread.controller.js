import threadModel from '../models/thread.model.js'
import postModel from '../models/post.model.js'
import BaseController from './base.controller.js'
import { isLT, getTokenContent } from '../middleware/auth.js'

class ThreadController extends BaseController {
	constructor() {
		super({ model: threadModel, paramKey: 'id' })
	}

	create() {
		return async (req, res) => {
			if (!req.body?.title) {
				res.status(400).send('bad request')
				return
			}
			const thread = await threadModel.create(req.body)
			res.status(200).send(thread)
		}
	}

	update() {
		return async (req, res) => {
			if (!this._validateParams(req, res)) return
			const thread = await this._findRecord(req)
			if (!thread) {
				res.status(404).send('not found')
				return
			}
			const posts = await postModel.findAll({ where: { threadId: req.params.id } })
			if (getTokenContent(req).sub !== posts[0]?.createdBy && !isLT(req)) {
				res.status(403).send()
				return
			}
			await this.model.update(req.body, { where: { id: req.params.id } })
			res.status(200).send(thread)
		}
	}

	deleteOne() {
		return async (req, res) => {
			if (!this._validateParams(req, res)) return
			const thread = await this._findRecord(req)
			if (!thread) {
				res.status(404).send('not found')
				return
			}
			const posts = await postModel.findAll({ where: { threadId: req.params.id } })
			if (getTokenContent(req).sub !== posts[0]?.createdBy && !isLT(req)) {
				res.status(403).send()
				return
			}
			await this.model.destroy({ where: { id: req.params.id } })
			res.status(200).send(thread)
		}
	}
}

export default new ThreadController()
