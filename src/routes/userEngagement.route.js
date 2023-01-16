import { Router } from 'express';
import keycloak from '../config/keycloak.js';
import { findAll, findOne, createOrUpdate } from '../controllers/userEngagement.controller.js'

var router = new Router();
  
	router.get('/', keycloak.protect(), findAll);
	router.get('/:uuid/:year', keycloak.protect(), findOne);
	router.post('/:uuid/:year', keycloak.protect(), createOrUpdate);

export default router