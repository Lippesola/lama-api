import { Router } from 'express';
import keycloak from '../config/keycloak.js';
import PostController from '../controllers/post.controller.js'

var router = new Router();
const postController = new PostController();

    router.get('/', keycloak.protect(), postController.getAll);
    router.get('/:id', keycloak.protect(), postController.getOne);
    router.post('/', keycloak.protect(), postController.create);
    router.post('/:id', keycloak.protect(), postController.update);
    router.delete('/:id', keycloak.protect(), postController.deleteOne);

export default router