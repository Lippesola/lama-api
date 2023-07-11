import { Router } from 'express';
import keycloak from '../config/keycloak.js';
import { findAllMailinglists } from '../controllers/mail.controller.js'

var router = new Router();
  
	router.get('/', keycloak.protect(), findAllMailinglists);

export default router