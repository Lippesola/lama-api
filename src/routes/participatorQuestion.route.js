import { Router } from 'express';
import keycloak from '../config/keycloak.js';
import { findAll, findOne, createOrUpdate } from '../controllers/participatorQuestion.controller.js'

var router = new Router();
  
	router.get('/', keycloak.protect(), findAll);
	router.get('/:id', keycloak.protect(), findOne);
	router.post('/:id', keycloak.protect(['admin']), createOrUpdate);

export default router