module.exports = app => {
    const keycloak = require('../config/keycloak.js').getKeycloak();
    const Event = require("../controllers/event.controller.js");

    var router = require("express").Router();
  
	router.get('/', keycloak.protect(), Event.findAll);
	router.get('/:id', keycloak.protect(), Event.findOne);
	router.post('/:id', keycloak.protect(), Event.createOrUpdate);

    app.use('/event', router);
  };