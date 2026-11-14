import { Op } from 'sequelize'
import sequelize from '../models/db.model.js'
import settingModel from '../models/setting.model.js'
import eventModel from '../models/event.model.js'
import userModel from '../models/user.model.js'
import userYearModel from '../models/userYear.model.js'
import userDocumentModel from '../models/userDocument.model.js'
import kcAdminClient from '../config/keycloak-cli.js'
import { evaluateDocuments, ACTIVATED } from '../utils/documentRetention.js'
import { getTokenContent } from '../middleware/auth.js'

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

async function getCurrentYear() {
	const setting = await settingModel.findByPk('currentYear')
	return setting ? parseInt(setting.value, 10) : null
}

// Collects, for every user with documents, which documents must be reset when `newYear` starts.
async function planDocumentResets(newYear, transaction) {
	const documents = await userDocumentModel.findAll({ transaction })
	const handedInYears = documents.flatMap(d => [d.criminalRecord, d.selfCommitment, d.privacyCommitment, d.parentalConsent])
		.filter(y => y >= 2000)
	if (!handedInYears.length) return []
	const minYear = Math.min(...handedInYears)

	const userYears = await userYearModel.findAll({
		where: { status: ACTIVATED, year: { [Op.gt]: minYear, [Op.lt]: newYear } },
		attributes: ['uuid', 'year'],
		transaction,
	})
	const activeByUser = new Map()
	for (const { uuid, year } of userYears) {
		if (!activeByUser.has(uuid)) activeByUser.set(uuid, new Set())
		activeByUser.get(uuid).add(year)
	}

	const plan = []
	for (const document of documents) {
		const { reset, skipped } = evaluateDocuments(document, activeByUser.get(document.uuid) || new Set(), newYear)
		if (reset.length || skipped.length) plan.push({ uuid: document.uuid, reset, skipped })
	}
	return plan
}

async function withUserNames(plan) {
	const users = await userModel.findAll({ where: { uuid: plan.map(p => p.uuid) }, attributes: ['uuid', 'firstName', 'lastName'] })
	const names = new Map(users.map(u => [u.uuid, `${u.firstName} ${u.lastName}`]))
	return plan.map(p => ({ ...p, name: names.get(p.uuid) || p.uuid }))
}

function validateEvents(events, existingEvents, newYear) {
	if (!Array.isArray(events)) return ['events fehlt']
	const errors = []
	const byId = new Map(events.map(e => [e.id, e]))
	for (const existing of existingEvents) {
		const event = byId.get(existing.id)
		if (!event) {
			errors.push(`Termin "${existing.id}" fehlt`)
			continue
		}
		const hasStart = !!event.start
		const hasEnd = !!event.end
		if (hasStart !== hasEnd) {
			errors.push(`Termin "${existing.id}": Start und Ende müssen beide gesetzt oder beide leer sein`)
			continue
		}
		if (!hasStart) continue
		if (!DATE_PATTERN.test(event.start) || !DATE_PATTERN.test(event.end) || isNaN(new Date(event.start)) || isNaN(new Date(event.end))) {
			errors.push(`Termin "${existing.id}": ungültiges Datum`)
			continue
		}
		if (event.end < event.start) errors.push(`Termin "${existing.id}": Ende liegt vor dem Start`)
		if (!event.start.startsWith(newYear + '-') || !event.end.startsWith(newYear + '-')) {
			errors.push(`Termin "${existing.id}": liegt nicht im Jahr ${newYear}`)
		}
	}
	return errors
}

async function ensureKeycloakGroups(year, uuid) {
	try {
		const groups = await kcAdminClient.groups.find({ search: String(year), exact: true })
		let parent = groups.find(g => g.name === String(year))
		if (!parent) parent = await kcAdminClient.groups.create({ name: String(year) })
		const subGroups = await kcAdminClient.groups.listSubGroups({ parentId: parent.id })
		let teamGroup = subGroups.find(g => g.name === year + '_Team')
		if (!teamGroup) teamGroup = await kcAdminClient.groups.createChildGroup({ id: parent.id }, { name: year + '_Team' })
		// the executing admin is part of the new team right away
		await kcAdminClient.users.addToGroup({ id: uuid, groupId: teamGroup.id })
		return true
	} catch (e) {
		console.error('Could not create Keycloak groups for year ' + year, e)
		return false
	}
}

class AdminController {
	// GET /admin/yearChange  -> current state + dry run of the document reset
	yearChangePreview() {
		return async (req, res) => {
			const currentYear = await getCurrentYear()
			if (!currentYear) return res.status(500).send('currentYear setting missing')
			const newYear = currentYear + 1
			const events = await eventModel.findAll({ order: [['start', 'ASC']] })
			const plan = await withUserNames(await planDocumentResets(newYear))
			res.status(200).send({ currentYear, newYear, events, documentResets: plan })
		}
	}

	// POST /admin/yearChange  { year, events: [{id, start, end, location}] }
	yearChange() {
		return async (req, res) => {
			const currentYear = await getCurrentYear()
			if (!currentYear) return res.status(500).send('currentYear setting missing')
			const newYear = currentYear + 1
			if (parseInt(req.body?.year, 10) !== newYear) {
				return res.status(400).send({ errors: [`Der Jahreswechsel ist nur auf ${newYear} möglich`] })
			}
			const existingEvents = await eventModel.findAll()
			const errors = validateEvents(req.body.events, existingEvents, newYear)
			if (errors.length) return res.status(400).send({ errors })

			// Keycloak first: if this fails nothing has been changed yet and the change can simply be retried.
			// The step is idempotent, so a later DB failure does no harm either.
			if (!await ensureKeycloakGroups(newYear, getTokenContent(req).sub)) {
				return res.status(500).send({ errors: ['Keycloak-Gruppen konnten nicht angelegt werden, es wurde nichts verändert'] })
			}

			let resetCount = 0
			let plan
			try {
				await sequelize.transaction(async (transaction) => {
					plan = await planDocumentResets(newYear, transaction)
					for (const { uuid, reset } of plan) {
						if (!reset.length) continue
						await userDocumentModel.update(
							Object.fromEntries(reset.map(type => [type, null])),
							{ where: { uuid }, transaction }
						)
						resetCount++
					}
					for (const event of req.body.events) {
						const existing = existingEvents.find(e => e.id === event.id)
						if (!existing) continue
						await eventModel.update(
							{
								start: event.start ? new Date(event.start) : null,
								end: event.end ? new Date(event.end) : null,
								...(event.location !== undefined ? { location: event.location } : {}),
							},
							{ where: { id: event.id }, transaction }
						)
					}
					// the executing admin is activated for the new year right away
					const adminUuid = getTokenContent(req).sub
					const adminYear = await userYearModel.findOne({ where: { uuid: adminUuid, year: newYear }, transaction })
					if (adminYear) {
						await adminYear.update({ status: ACTIVATED, ...(adminYear.assignee ? {} : { assignee: adminUuid }) }, { transaction })
					} else {
						await userYearModel.create({ uuid: adminUuid, year: newYear, status: ACTIVATED, assignee: adminUuid, registeredAt: new Date() }, { transaction })
					}
					await settingModel.update({ value: String(newYear) }, { where: { key: 'currentYear' }, transaction })
				})
			} catch (e) {
				console.error('Year change failed', e)
				return res.status(500).send({ errors: ['Jahreswechsel fehlgeschlagen, es wurde nichts verändert'] })
			}

			res.status(200).send({
				year: newYear,
				usersWithResetDocuments: resetCount,
				skippedLegacy: plan.filter(p => p.skipped.length).length,
			})
		}
	}
}

export default new AdminController()
