import { Router } from 'express';
import keycloak from '../config/keycloak.js';
import { findAll, findOne, createOrUpdate } from '../controllers/event.controller.js'

var router = new Router();
  
	router.get('/:id', keycloak.protect(), findOne);
	router.post('/:id', keycloak.protect(['admin']), createOrUpdate);

export default router