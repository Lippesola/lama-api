import { Router } from 'express';
import keycloak from '../config/keycloak.js';
import { findAll, findOne, createOrUpdate, sendMail } from '../controllers/mail.controller.js'

var router = new Router();
  
	router.get('/', keycloak.protect(['admin']), findAll);
	router.get('/:key', keycloak.protect(['admin']), findOne);
	router.post('/sendMail', keycloak.protect(), sendMail);
	router.post('/:key', keycloak.protect(['admin']), createOrUpdate);

export default router