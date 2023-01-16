import keycloak from '../config/keycloak.js';
import fs from 'fs'
import path from 'path';


export async function findOne(req, res) {
	if (!req.params && !req.params.uuid && !req.params.year) {
		res.status(400).send('bad request')
		return;
	}
  const userMotivation = await userTaskModel.findOne({where: {uuid: req.params.uuid, task: req.params.task}})
  if (userMotivation) {
    const filePath = __dirname + '/../../upload/motivation/' + userMotivation.hash + '.pdf';
    if (fs.existsSync(filePath)) {
      res.sendFile(path.resolve(filePath))
    } else {
      res.status(404).send('not found')
    }
  } else {
    res.status(404).send('not found')
  }
}

export async function createOrUpdate(req, res) {
  const { file } = req.files;
  const executingUser = req.kauth.grant.access_token.content.sub
  const isAdmin = req.kauth.grant.access_token.content.realm_access.roles.includes('admin')

  if (req.params.uuid !== executingUser && !isAdmin) {
    return res.status(403).send({
      message: "Forbidden!"
    });
  }

  
  if (!file) {
    return res.sendStatus(400)
  }
  
  if (file.mimetype !== 'application/pdf') {
    console.log(req.files)
    return res.sendStatus(400)
  }

  file.mv(__dirname + '/../../upload/motivation/' + file.md5 + '.pdf');

  const userTask = await userTaskModel.findOne({where: {uuid: req.params.uuid, year: req.params.year}})
	if (userTask) {
		userTaskModel.update({hash: file.md5}, {where: {uuid: req.params.uuid, year: req.params.year}});
		res.status(200).send(userTask)
	} else {
		var data = {
      uuid: req.params.uuid,
      year: req.params.year,
      hash: file.md5
    }
		userTaskModel.create(data)
		res.status(200).send(userTask)
	}


  res.sendStatus(200);
};
