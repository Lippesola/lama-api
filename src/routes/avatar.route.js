import { Router } from 'express';
import keycloak from '../config/keycloak.js';
import { findOne, createOrUpdate } from '../controllers/avatar.controller.js'

var router = new Router();

router.get('/:uuid', keycloak.protect(), findOne);
router.post('/:uuid', keycloak.protect(), createOrUpdate);

export default router