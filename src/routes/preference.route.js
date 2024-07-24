import { Router } from "express";
import keycloak from "../config/keycloak.js";
import { findAll, findOne, create, update, deleteOne } from "../controllers/preference.controller.js";

var router = new Router();
router.get('/', keycloak.protect(), findAll);
router.get('/:id', keycloak.protect(), findOne);
router.post('/', keycloak.protect(), create);
router.post('/:id', keycloak.protect(), update);
router.delete('/:id', keycloak.protect(), deleteOne);

export default router