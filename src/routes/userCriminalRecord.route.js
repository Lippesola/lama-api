import { Router } from 'express';
import keycloak from '../config/keycloak.js';
import { findOne } from '../controllers/userCriminalRecord.controller.js'

var router = new Router();

router.get('/:uuid', keycloak.protect(), findOne);

export default router