import UserMotivationModel from '../models/userMotivation.model.js'
import UserYearModel from '../models/userYear.model.js'
import SettingModel from '../models/setting.model.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function findOne(req, res) {
	if (!req.params && !req.params.uuid && !req.params.year) {
		res.status(400).send('bad request')
		return;
	}
  const userMotivation = await UserMotivationModel.findOne({where: {uuid: req.params.uuid, year: req.params.year}})
  if (userMotivation) {
    const filePath = __dirname + '/../../uploads/motivation/' + userMotivation.hash + '.pdf';
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
  const isAdmin = req.kauth.grant.access_token.content.groups.includes('admin')

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

  file.mv(__dirname + '/../../uploads/motivation/' + file.md5 + '.pdf');

  const userMotivation = await UserMotivationModel.findOne({where: {uuid: req.params.uuid, year: req.params.year}})
  const year = await SettingModel.findByPk('currentYear')
  const userYear = await UserYearModel.findOne({
    where: {
      uuid: req.params.uuid,
      year: year.value
    }
  })

	if (userMotivation) {
		UserMotivationModel.update({hash: file.md5}, {where: {uuid: req.params.uuid, year: req.params.year}});
    if (userYear.status == 1) {
      UserYearModel.update({status: 2, editedBy: req.kauth.grant.access_token.content.sub}, {
        where: {
          uuid: req.params.uuid,
          year: year.value
        }
      })
    }
		res.status(200).send(userMotivation)
	} else {
		var data = {
      uuid: req.params.uuid,
      year: req.params.year,
      hash: file.md5
    }
		UserMotivationModel.create(data)
    if (userYear.status == 1) {
      UserYearModel.update({status: 2, editedBy: req.kauth.grant.access_token.content.sub}, {
        where: {
          uuid: req.params.uuid,
          year: year.value
        }
      })
    }
		res.status(200).send(userMotivation)
	}
};
