import { Router } from 'express';
import keycloak from '../config/keycloak.js';
import { findAll, findOne, create, update } from '../controllers/responsibility.controller.js'

var router = new Router();
  
	router.get('/', keycloak.protect(), findAll);
	router.get('/:id', keycloak.protect(), findOne);
	router.post('/', keycloak.protect(['admin']), create);
	router.post('/:id', keycloak.protect(['admin']), update);

export default router