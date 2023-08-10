import { Router } from 'express';
import keycloak from '../config/keycloak.js';
import { findAll, findOne, createOrUpdate } from '../controllers/userPost.controller.js'

var router = new Router();

    router.get('/', keycloak.protect(), findAll);
    router.get('/:uuid/:post', keycloak.protect(), findOne);
    router.post('/:uuid/:post', keycloak.protect(), createOrUpdate);

export default router