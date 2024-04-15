import postModel from '../models/post.model.js'
import Controller from '../lama/controller.js'

export default class PostController extends Controller{
	constructor() {
		super(postModel)
	}

	validateData = (data) => {
		if (!data || !data.text || !data.threadId) {
			return false
		}
		return true
	}
}