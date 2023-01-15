module.exports = app => {
    const keycloak = require('../config/keycloak.js').getKeycloak();
    const UserMotivation = require("../controllers/userMotivation.controller.js");

    var router = require("express").Router();
  
	// router.get('/', keycloak.protect(), UserMotivation.findAll);
	router.get('/:uuid', UserMotivation.findOne);
	router.post('/:uuid', keycloak.protect(), UserMotivation.createOrUpdate);

    app.use('/userMotivation', router);
  };