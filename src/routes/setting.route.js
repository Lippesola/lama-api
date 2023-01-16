import { Router } from 'express';
import keycloak from '../config/keycloak.js';
import { findAll, findOne, createOrUpdate } from '../controllers/setting.controller.js'

var router = new Router();
  
	router.get('/', keycloak.protect(), findAll);
	router.get('/:key', keycloak.protect(), findOne);
	router.post('/:key', keycloak.protect(), createOrUpdate);

export default router