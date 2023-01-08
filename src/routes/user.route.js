module.exports = app => {
    const keycloak = require('../config/keycloak.js').getKeycloak();
    const User = require("../controllers/user.controller.js");

    var router = require("express").Router();
  
	router.get('/', keycloak.protect(), User.findAll);
	router.get('/:uuid', keycloak.protect(), User.findOne);
	router.post('/:uuid', keycloak.protect(), User.createOrUpdate);

    app.use('/user', router);
  };