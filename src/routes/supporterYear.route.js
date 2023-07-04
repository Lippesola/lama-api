import { Router } from 'express';
import keycloak from '../config/keycloak.js';
import { findAll, findOne, update } from '../controllers/supporterYear.controller.js'

var router = new Router();
  
	router.get('/', keycloak.protect(), findAll);
	router.get('/:uuid', keycloak.protect(), findOne);
	router.post('/:uuid', keycloak.protect(), update);

export default router