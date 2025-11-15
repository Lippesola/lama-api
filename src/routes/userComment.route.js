import { Router } from 'express';
import keycloak from '../config/keycloak.js';
import { findAll, findOne, createOrUpdate } from '../controllers/userComment.controller.js'

var router = new Router();

    router.get('/', keycloak.protect(), findAll);
    router.get('/:uuid', keycloak.protect(), findOne);
    router.post('/:uuid', keycloak.protect(), createOrUpdate);

export default router