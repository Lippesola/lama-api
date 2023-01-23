import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function findOne (req, res) { 
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

export function createOrUpdate(req, res) { 
  const { image } = req.files;
  const executingUser = req.kauth.grant.access_token.content.sub
  const isAdmin = req.kauth.grant.access_token.content.groups.includes('admin')

  if (req.params.uuid !== executingUser && !isAdmin) {
    return res.status(403).send({
      message: "Forbidden!"
    });
  }

  
  if (!image) {
    return res.sendStatus(400)
  }
  
  if (!image.mimetype.includes('image/')) {
    return res.sendStatus(400)
  }

  image.mv(__dirname + '/../../uploads/avatar/' + req.params.uuid + '.jpeg');
  res.sendStatus(200);
};
