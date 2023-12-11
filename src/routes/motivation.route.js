import { Router } from 'express';
import keycloak from '../config/keycloak.js';
import { findAll, findOne, update } from '../controllers/motivation.controller.js'

var router = new Router();

    router.get('/', keycloak.protect(), findAll);
    router.get('/:id', keycloak.protect(), findOne);
    router.post('/', keycloak.protect(), update);

export default router