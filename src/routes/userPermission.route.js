import { Router } from 'express';
import keycloak from '../config/keycloak.js';
import { findAll, findOne, createOrUpdate } from '../controllers/userPermission.controller.js'

var router = new Router();

    router.get('/', keycloak.protect(), findAll);
    router.get('/:uuid/:permission', keycloak.protect(), findOne);
    router.post('/:uuid/:permission', keycloak.protect(), createOrUpdate);

export default router