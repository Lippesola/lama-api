export default class BaseController {
	constructor({ model, paramKey = 'id', paramToField = {}, findAllOptions = {} }) {
		this.model = model
		this.paramKey = Array.isArray(paramKey) ? paramKey : [paramKey]
		this.paramToField = paramToField
		this.findAllOptions = findAllOptions
		this.useFindByPk = this.paramKey.length === 1 && !this.paramToField[this.paramKey[0]]
	}

	_validateParams(req, res) {
		for (const key of this.paramKey) {
			if (!req.params?.[key]) {
				res.status(400).send('bad request')
				return false
			}
		}
		return true
	}

	_getWhereClause(req) {
		const where = {}
		for (const key of this.paramKey) {
			const fieldName = this.paramToField[key] || key
			where[fieldName] = req.params[key]
		}
		return where
	}

	async _findRecord(req) {
		if (this.useFindByPk) {
			return await this.model.findByPk(req.params[this.paramKey[0]])
		}
		return await this.model.findOne({ where: this._getWhereClause(req) })
	}

	findAll() {
		return async (req, res) => {
			try {
				const result = await this.model.findAll({ where: req.query, ...this.findAllOptions })
				res.status(200).send(result)
			} catch (e) {
				console.log(e)
				res.status(400).send()
			}
		}
	}

	findOne() {
		return async (req, res) => {
			if (!this._validateParams(req, res)) return
			const record = await this._findRecord(req)
			if (record) {
				res.status(200).send(record)
			} else {
				res.status(404).send('not found')
			}
		}
	}

	create() {
		return async (req, res) => {
			try {
				const record = await this.model.create(req.body)
				res.status(200).send(record)
			} catch (e) {
				console.log(e)
				res.status(400).send()
			}
		}
	}

	update() {
		return async (req, res) => {
			if (!this._validateParams(req, res)) return
			const record = await this._findRecord(req)
			if (record) {
				await record.update(req.body)
				res.status(200).send(record)
			} else {
				res.status(404).send('not found')
			}
		}
	}

	createOrUpdate() {
		return async (req, res) => {
			if (!this._validateParams(req, res)) return
			const record = await this._findRecord(req)
			if (record) {
				await record.update(req.body)
				res.status(200).send(record)
			} else {
				const data = { ...req.body, ...this._getWhereClause(req) }
				const created = await this.model.create(data)
				res.status(200).send(created)
			}
		}
	}

	deleteOne() {
		return async (req, res) => {
			if (!this._validateParams(req, res)) return
			const record = await this._findRecord(req)
			if (record) {
				await this.model.destroy({ where: this._getWhereClause(req) })
				res.status(200).send(record)
			} else {
				res.status(404).send('not found')
			}
		}
	}
}
