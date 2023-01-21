import { Router } from 'express';
import keycloak from '../config/keycloak.js';
import { findOne, createOrUpdate } from '../controllers/userMotivation.controller.js'

var router = new Router();

    router.get('/:uuid/:year', keycloak.protect(), findOne);
    router.post('/:uuid/:year', keycloak.protect(), createOrUpdate);

export default router