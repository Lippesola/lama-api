import { Router } from 'express';
import keycloak from '../config/keycloak.js';
import { findAll, findOne, createOrUpdate } from '../controllers/setting.controller.js'

var router = new Router();
  
	router.get('/:key', keycloak.protect(), findOne);
	router.post('/:key', keycloak.protect(['admin']), createOrUpdate);

export default router