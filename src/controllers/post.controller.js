import postModel from '../models/post.model.js'
import BaseController from './base.controller.js'
import { isLT, getTokenContent } from '../middleware/auth.js'

class PostController extends BaseController {
	constructor() {
		super({ model: postModel, paramKey: 'id' })
	}

	create() {
		return async (req, res) => {
			if (!req.body?.threadId || !req.body?.text) {
				res.status(400).send('bad request')
				return
			}
			const data = { ...req.body, createdBy: getTokenContent(req).sub }
			await postModel.create(data)
			res.status(200).send()
		}
	}

	update() {
		return async (req, res) => {
			if (!this._validateParams(req, res)) return
			const post = await this._findRecord(req)
			if (!post) {
				res.status(404).send('not found')
				return
			}
			if (getTokenContent(req).sub !== post.createdBy && !isLT(req)) {
				res.status(403).send()
				return
			}
			await this.model.update(req.body, { where: { id: req.params.id } })
			res.status(200).send(post)
		}
	}

	deleteOne() {
		return async (req, res) => {
			if (!this._validateParams(req, res)) return
			const post = await this._findRecord(req)
			if (!post) {
				res.status(404).send('not found')
				return
			}
			if (getTokenContent(req).sub !== post.createdBy && !isLT(req)) {
				res.status(403).send()
				return
			}
			await this.model.destroy({ where: { id: req.params.id } })
			res.status(200).send(post)
		}
	}
}

export default new PostController()
