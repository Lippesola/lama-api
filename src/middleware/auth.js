import userPermissionModel from '../models/userPermission.model.js'
import settingModel from '../models/setting.model.js'

export function getTokenContent(req) {
	return req.kauth.grant.access_token.content
}

export function isLT(req) {
	return getTokenContent(req).groups?.includes('Leitungsteam')
}

export function isAdmin(req) {
	return getTokenContent(req).groups?.includes('admin')
}

export function isSelf(req, uuidParam = 'uuid') {
	return getTokenContent(req).sub === req.params[uuidParam]
}

export function isTeam(req, year) {
	return getTokenContent(req).groups?.includes(year + '_Team')
}

export async function hasPermission(req, permission) {
	const uuid = getTokenContent(req).sub
	const perm = await userPermissionModel.findOne({ where: { uuid, permission } })
	return !!perm?.allowed
}

export async function isLTOrHasPermission(req, permission) {
	return isLT(req) || await hasPermission(req, permission)
}

export function selfOrLT(req, uuidParam = 'uuid') {
	return isSelf(req, uuidParam) || isLT(req)
}

export function requireAuth(checkFn) {
	return async (req, res, next) => {
		if (await checkFn(req)) {
			next()
		} else {
			res.status(403).send()
		}
	}
}

export const requireAdmin = requireAuth(isAdmin)

export async function isActiveTeam(req) {
	if (isLT(req)) return true
	const year = (await settingModel.findByPk('currentYear'))?.value
	return !!year && !!isTeam(req, year)
}

export const requireTeam = requireAuth(isActiveTeam)

export const requireSelfOrTeam = (uuidParam = 'uuid') =>
	requireAuth(async req => isSelf(req, uuidParam) || await isActiveTeam(req))
