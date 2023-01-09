module.exports = app => {
    const keycloak = require('../config/keycloak.js').getKeycloak();
    const UserEngagement = require("../controllers/userEngagement.controller.js");

    var router = require("express").Router();
  
	router.get('/', keycloak.protect(), UserEngagement.findAll);
	router.get('/:uuid/:year', keycloak.protect(), UserEngagement.findOne);
	router.post('/:uuid/:year', keycloak.protect(), UserEngagement.createOrUpdate);

    app.use('/userEngagement', router);
  };