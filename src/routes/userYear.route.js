import { Router } from 'express';
import keycloak from '../config/keycloak.js';
import { findAll, findOne, createOrUpdate, additionalInfo } from '../controllers/userYear.controller.js'

var router = new Router();
  
	router.get('/', keycloak.protect(), findAll);
	router.get('/additionalInfo/:uuid', keycloak.protect(), additionalInfo);
	router.get('/:uuid/:year', keycloak.protect(), findOne);
	router.post('/:uuid/:year', keycloak.protect(), createOrUpdate);

export default router