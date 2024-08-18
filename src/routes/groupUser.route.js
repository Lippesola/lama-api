import { Router } from "express";
import keycloak from "../config/keycloak.js";
import { findAll, findOne, createOrUpdate, deleteOne } from "../controllers/groupUser.controller.js";

var router = new Router();
router.get('/', keycloak.protect(), findAll);
router.get('/:group/:uuid', keycloak.protect(), findOne);
router.post('/', keycloak.protect(), createOrUpdate);
router.delete('/:group/:uuid', keycloak.protect(), deleteOne);

export default router