import { Router } from 'express';
import keycloak from '../config/keycloak.js';
import { initUsers, fillTeamMailinglist } from '../controllers/misc.controller.js'

var router = new Router();

router.get('/initUsers', keycloak.protect(['admin']), initUsers);
router.get('/fillTeamMailinglist', keycloak.protect(['admin']), fillTeamMailinglist);

export default router