import { Router } from "express";
import keycloak from "../config/keycloak.js";
import { findAll, findOne, create, update, deleteOne, autoSort } from "../controllers/group.controller.js";

var router = new Router();
router.get('/', keycloak.protect(), findAll);
router.get('/:id', keycloak.protect(), findOne);
router.post('/', keycloak.protect(), create);
router.post('/:id', keycloak.protect(), update);
router.delete('/:id', keycloak.protect(), deleteOne);
router.post('/autoSort/:year/:week', keycloak.protect(), autoSort);

export default router