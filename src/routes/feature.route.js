import { Router } from 'express';
import keycloak from '../config/keycloak.js';
import { findAll, findOne, create, update } from '../controllers/feature.controller.js'

var router = new Router();

    router.get('/', findAll);
    router.get('/:id', findOne);
    router.post('/', keycloak.protect(['admin']), create);
    router.post('/:id', keycloak.protect(['admin']), update);

export default router