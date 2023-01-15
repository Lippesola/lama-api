const keycloak = require('../config/keycloak.js').getKeycloak();
const fs = require('fs')
const path = require('path')


exports.findOne = async (req, res) => {
	if (!req.params && !req.params.uuid) {
		res.status(400).send('bad request')
		return;
	}
  const filePath = __dirname + '/../../upload/avatar/' + req.params.uuid + '.jpeg';
  if (fs.existsSync(filePath)) {
		res.sendFile(path.resolve(filePath))
	} else {
		res.status(404).send('not found')
	}
}

exports.createOrUpdate = (req, res) => {
  const { image } = req.files;
  console.log(req.files);
  const executingUser = req.kauth.grant.access_token.content.sub
  const isAdmin = req.kauth.grant.access_token.content.realm_access.roles.includes('admin')

  if (req.params.uuid !== executingUser && !isAdmin) {
    return res.status(403).send({
      message: "Forbidden!"
    });
  }

  
  if (!image) {
    return res.sendStatus(400)
  }
  
  if (!image.mimetype.includes('image/')) {
    console.log(req.files)
    return res.sendStatus(400)
  }

  image.mv(__dirname + '/../../upload/avatar/' + req.params.uuid + '.jpeg');
  res.sendStatus(200);
};
