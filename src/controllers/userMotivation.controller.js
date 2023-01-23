import userYearModel from '../models/userYear.model.js'
import settingModel from '../models/setting.model.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function findOne(req, res) {
	if (!req.params || !req.params.uuid || !req.params.year) {
		res.status(400).send('bad request')
		return;
	}
	const isLT = req.kauth.grant.access_token.content.groups.includes(req.params.year + '_LT')
	const self = req.kauth.grant.access_token.content.sub === req.params.uuid
  if (!self && !isLT) {
		res.status(403).send()
		return;
	}
  const userYear = await userYearModel.findOne({where: {uuid: req.params.uuid, year: req.params.year}})
  if (userYear) {
    const filePath = __dirname + '/../../uploads/motivation/' + userYear.motivationHash + '.pdf';
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
  const self = req.kauth.grant.access_token.content.sub === req.params.uuid
  if ('!self') {
		res.status(403).send()
		return;
  }
  
  if (!file) {
    return res.sendStatus(400)
  }
  
  if (file.mimetype !== 'application/pdf') {
    console.log(req.files)
    return res.sendStatus(400)
  }

  file.mv(__dirname + '/../../uploads/motivation/' + file.md5 + '.pdf');
  
	const year = req.params.year || (await settingModel.findByPk('currentYear')).value
  const userYear = await userYearModel.findOne({
    where: {
      uuid: req.params.uuid,
      year: year
    }
  })
  let data = {
    motivationHash: file.md5
  }
	if (userYear) {
    if (userYear.status == 1) {
      data['status'] = 2;
    }
    userYearModel.update(data, {
      where: {
        uuid: req.params.uuid,
        year: year
      }
    })
		res.status(200).send()
	} else {
		res.status(404).send()
	}
};
