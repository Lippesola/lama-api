module.exports = app => {
    const keycloak = require('../config/keycloak.js').getKeycloak();
    const Avatar = require("../controllers/avatar.controller.js");

    var router = require("express").Router();
  
	// router.get('/', keycloak.protect(), Avatar.findAll);
	router.get('/:uuid', Avatar.findOne);
	router.post('/:uuid', keycloak.protect(), Avatar.createOrUpdate);

    app.use('/avatar', router);
  };