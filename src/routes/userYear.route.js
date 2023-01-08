module.exports = app => {
    const keycloak = require('../config/keycloak.js').getKeycloak();
    const UserYear = require("../controllers/userYear.controller.js");

    var router = require("express").Router();
  
	router.get('/', keycloak.protect(), UserYear.findAll);
	router.get('/:uuid/:year', keycloak.protect(), UserYear.findOne);
	router.post('/:uuid/:year', keycloak.protect(), UserYear.createOrUpdate);

    app.use('/userYear', router);
  };