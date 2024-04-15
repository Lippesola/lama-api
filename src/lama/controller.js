import settingModel from '../models/setting.model.js'
export default class Controller {
    constructor(model) {
        this.model = model
        this.acl = {
            create: {
                self: true,
                leader: true,
                team: false
            },
            read: {
                self: true,
                leader: true,
                team: false
            },
            update: {
                self: true,
                leader: true,
                team: false
            },
            delete: {
                self: true,
                leader: true,
                team: false
            }
        }
    }

    getAll = async (req, res) => {
        try {
            const entities = await this.model.findAll({where: req.query})
            res.status(200).send(entities)
        } catch(e) {
            console.log(e);
            res.status(400).send()
        }
    }

    getOne = async (req, res) => {
        try {
            const entity = await this.findOne(req)
            if (entity) {
                res.status(200).send(entity)
            } else {
                res.status(404).send('not found')
            }
        } catch(e) {
            console.log(e);
            res.status(400).send()
        }
    }

    create = async (req, res) => {
        try {
            const data = {...req.body, createdBy: req.kauth.grant.access_token.content.sub}
            if (!this.validateData(data)) {
                res.status(400).send('bad request')
                return;
            }
            const entity = await this.model.create(data)
            res.status(200).send(entity)
        } catch(e) {
            console.log(e);
            res.status(400).send()
        }
    }

    update = async (req, res, entity) => {
        try {
            if (!entity) {
                entity = await this.findOne(req)
            }
            if (entity) {
                if (!this.isSelf(req, entity.createdBy || entity.uuid) && !this.isLT(req)) {
                    res.status(403).send()
                    return;
                }
                const data = {...entity.dataValues, ...req.body}
                if (!this.validateData(data)) {
                    res.status.send('bad request')
                    return;
                }
                this.model.update(req.body, {where: req.params});
                res.status(200).send(entity)
            } else {
                res.status(404).send('not found')
            }
        } catch(e) {
            console.log(e);
            res.status(400).send()
        }
    }

    createOrUpdate = async (req, res) => {
        const entity = await this.findOne(req)
        if (entity) {
            this.update(req, res, entity)
        } else {
            this.create(req, res)
        }
    }

    deleteOne = async (req, res) => {
        try {
            const entity = await this.findOne(req)
            if (entity) {
                if (!this.isSelf(req, entity.createdBy) && !this.isLT(req)) {
                    res.status(403).send()
                    return;
                }
                this.model.destroy({where: req.params});
                res.status(200).send(entity)
            } else {
                res.status(404).send('not found')
            }
        } catch(e) {
            console.log(e);
            res.status(400).send()
        }
    }

    findOne = async (req) => {
        let entity;
        if (this.primaryKeys) {
            if (!this.primaryKeys.every(key => req.params[key])) {
                throw new Error('bad request')
            }
            entity = await this.model.findOne({where: req.params})
        } else {
            if (!req.params || !req.params.id) {
                throw new Error('bad request')
            }
            entity = await this.model.findByPk(req.params.id)
        }
        return entity;
    }

    validateData = (data) => {
        return true
    }

    isAllowed = async (req, access, year) => {
        if (this.isAdmin(req)) return true
        if (this.acl[access].self && this.isSelf(req)) return true
        year = year || await this.getCurrentYear()
        if (this.acl[access].leader && this.isLT(req, year)) return true
        if (this.acl[access].team && this.isTeam(req, year)) return true
        return false
    }

    getCurrentYear = async () => {return (await settingModel.findByPk('currentYear')).value}

    checkGroup = (req, groupName) => {
        return req.kauth.grant.access_token.content.groups?.includes(groupName)
    }

    isTeam = async(req, year) => {
        return this.checkGroup((year || await this.getCurrentYear()) + '_Team')
    }

    isLT = async(req, year) => {
        return this.checkGroup((year || await this.getCurrentYear()) + '_LT')
    }

    isAdmin = (req) => {
        return this.checkGroup('admin')
    }

    isSelf = (req, id) => {
        return req.kauth.grant.access_token.content.sub === id
    }
}