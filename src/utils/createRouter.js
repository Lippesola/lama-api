import { Router } from 'express'
import keycloak from '../config/keycloak.js'

export default function createRouter({ controller, methods = [], paramPath, auth = {}, middleware = {}, extraRoutes = [] }) {
	const router = new Router()
	const idPath = paramPath || (controller.paramKey ? '/' + controller.paramKey.map(k => ':' + k).join('/') : '/:id')

	const defaultAuth = keycloak.protect()
	const readAuth = auth.read !== undefined ? auth.read : defaultAuth
	const writeAuth = auth.write !== undefined ? auth.write : defaultAuth

	function getAuth(method) {
		if (auth[method] !== undefined) return auth[method]
		return (method === 'findAll' || method === 'findOne') ? readAuth : writeAuth
	}

	function getMw(method) {
		const mw = middleware[method] || []
		return Array.isArray(mw) ? mw : [mw]
	}

	function buildHandlers(method, handler) {
		const a = getAuth(method)
		const mw = getMw(method)
		return a ? [a, ...mw, handler] : [...mw, handler]
	}

	const routeMap = {
		findAll:        () => router.get('/', ...buildHandlers('findAll', controller.findAll())),
		findOne:        () => router.get(idPath, ...buildHandlers('findOne', controller.findOne())),
		create:         () => router.post('/', ...buildHandlers('create', controller.create())),
		update:         () => router.post(idPath, ...buildHandlers('update', controller.update())),
		createOrUpdate: () => router.post(idPath, ...buildHandlers('createOrUpdate', controller.createOrUpdate())),
		deleteOne:      () => router.delete(idPath, ...buildHandlers('deleteOne', controller.deleteOne())),
	}

	for (const method of methods) {
		if (routeMap[method]) routeMap[method]()
	}

	for (const route of extraRoutes) {
		const a = route.auth !== undefined ? route.auth : writeAuth
		const mw = route.middleware || []
		const handlers = a ? [a, ...mw, route.handler] : [...mw, route.handler]
		router[route.method](route.path, ...handlers)
	}

	return router
}
