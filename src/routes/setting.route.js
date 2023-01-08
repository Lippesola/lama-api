module.exports = app => {
    const keycloak = require('../config/keycloak.js').getKeycloak();
    const Setting = require("../controllers/setting.controller.js");

    var router = require("express").Router();
  
	router.get('/', keycloak.protect(), Setting.findAll);
	router.get('/:key', keycloak.protect(), Setting.findOne);
	router.post('/:key', keycloak.protect(), Setting.createOrUpdate);

    app.use('/setting', router);
  };