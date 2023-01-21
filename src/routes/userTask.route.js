import { Router } from 'express';
import keycloak from '../config/keycloak.js';
import { findAll, findOne, createOrUpdate } from '../controllers/userTask.controller.js'

var router = new Router();

    router.get('/', keycloak.protect(['admin']), findAll);
    router.get('/:uuid/:year', keycloak.protect(['admin']), findOne);
    router.post('/:uuid/:year', keycloak.protect(['admin']), createOrUpdate);

export default router