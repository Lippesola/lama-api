module.exports = app => {
    const keycloak = require('../config/keycloak.js').getKeycloak();
    const UserTask = require("../controllers/userTask.controller.js");

    var router = require("express").Router();
  
	router.get('/', keycloak.protect(), UserTask.findAll);
	router.get('/:uuid/:task', keycloak.protect(), UserTask.findOne);
	router.post('/:uuid/:task', keycloak.protect(), UserTask.createOrUpdate);

    app.use('/userTask', router);
  };