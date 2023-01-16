import { Router } from 'express';
import keycloak from '../config/keycloak.js';
import { findAll, findOne, createOrUpdate } from '../controllers/event.controller.js'

var router = new Router();
  
	router.get('/', keycloak.protect(), findAll);
	router.get('/:id', keycloak.protect(), findOne);
	router.post('/:id', keycloak.protect(), createOrUpdate);

export default router