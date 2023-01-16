import { Router } from 'express';
import keycloak from '../config/keycloak.js';
import { initUsers } from '../controllers/misc.controller.js'

var router = new Router();

router.get('/initUsers', keycloak.protect(['admin']), initUsers);

export default router