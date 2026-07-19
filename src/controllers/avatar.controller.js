import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';
import { isAdmin, isSelf } from '../middleware/auth.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class AvatarController {
	findOne() {
		return async (req, res) => {
			if (!req.params || !req.params.uuid) {
				res.status(400).send('bad request')
				return;
			}
			const filePath = __dirname + '/../../uploads/avatar/' + req.params.uuid + '.jpeg';
			if (fs.existsSync(filePath)) {
				res.sendFile(path.resolve(filePath))
			} else {
				res.status(404).send('not found')
			}
		}
	}

	createOrUpdate() {
		return (req, res) => {
			const { image } = req.files;
			if (!isSelf(req, 'uuid') && !isAdmin(req)) {
				return res.status(403).send({ message: "Forbidden!" });
			}
			if (!image) return res.sendStatus(400)
			if (!image.mimetype.includes('image/')) return res.sendStatus(400)
			image.mv(__dirname + '/../../uploads/avatar/' + req.params.uuid + '.jpeg');
			res.sendStatus(200);
		}
	}
}

export default new AvatarController()
