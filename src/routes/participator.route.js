import { Router } from 'express';
import keycloak from '../config/keycloak.js';
import { findAll, findOne, createOrUpdate } from '../controllers/participator.controller.js'

var router = new Router();
  
	router.get('/', keycloak.protect(), findAll);
	router.get('/:orderId/:positionId', keycloak.protect(), findOne);
	router.post('/:orderId/:positionId', keycloak.protect(), createOrUpdate);

export default router