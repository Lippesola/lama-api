import mailModel from '../models/mail.model.js'
import mail from '../config/mail.js'
import userModel from '../models/user.model.js';
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import nodemailer from 'nodemailer';
import settingModel from "../models/setting.model.js";
import { convert } from 'html-to-text';
import userPermissionModel from '../models/userPermission.model.js';
import { Op } from 'sequelize';

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
	username: mail.mailgun.username,
	key: mail.mailgun.key,
	url: mail.mailgun.url
})

export async function findAll(req, res) {
	try {
		const setting = await mailModel.findAll({where: req.query})
		res.status(200).send(setting)
	} catch(e) {
		res.status(400).send()
	}
}

export async function findOne(req, res) {
	if (!req.params || !req.params.key) {
		res.status(400).send('bad request')
		return;
	}
	const setting = await mailModel.findByPk(req.params.key)
	if (setting) {
		res.status(200).send(setting)
	} else {
		res.status(404).send('not found')
	}
}

export async function createOrUpdate(req, res) {
	if (!req.params || !req.params.key) {
		res.status(400).send('bad request')
		return;
	}
	const setting = await mailModel.findByPk(req.params.key)
	if (setting) {
		mailModel.update(req.body, {where: {key: req.params.key}});
		res.status(200).send(setting)
	} else {
		var data = req.body
		data.key = req.params.key
		mailModel.create(data)
		res.status(200).send(setting)
	}
}

export function listDomains() {
	mg.domains.list()
	.then(data => console.log(data))
	.catch(err => console.error(err));
}

export async function findAllMailinglists(req, res) {
	const lists = (await mg.lists.list()).items
	const year = (await settingModel.findByPk('currentYear')).value
	const isLT = req.kauth.grant.access_token.content.groups.includes(year + '_LT')
	if (isLT) {
		res.status(200).send(lists)
		return;
	}
	var ret = lists.filter(list => list.address.toLowerCase().startsWith('team' + year + '@'))
	const mailPermissions = await userPermissionModel.findAll({
		where: {
			uuid: req.kauth.grant.access_token.content.sub,
			allowed: true,
			permission: {
				[Op.like]: 'mailinglist.%'
			}
		}
	})
	mailPermissions.forEach(permission => {
		const list = lists.find(list => list.address.toLowerCase().startsWith(permission.permission.toLowerCase().split('.')[1]))
		if (list) ret.push(list)
	})
	res.status(200).send(ret)
}

export async function sendMail(req, res) {
	if (!req.body || !req.body.addresses.length || !req.body.subject || req.body.content === '<br>') {
		let missingKeys = []
		if (!req.body.addresses.length) missingKeys.push('addresses')
		if (!req.body.subject) missingKeys.push('subject')
		if (req.body.content == '<br>') missingKeys.push('content')
		res.status(400).send(missingKeys)
		return;
	}
	const year = (await settingModel.findByPk('currentYear')).value
	const isLT = req.kauth.grant.access_token.content.groups.includes(year + '_LT')
	const addresses = req.body.addresses
	if (!isLT) {
		const mailPermissions = await userPermissionModel.findAll({
			where: {
				uuid: req.kauth.grant.access_token.content.sub,
				allowed: true,
				permission: {
					[Op.like]: 'mailinglist.%'
				}
			}
		})	
		let allowed = true;
		addresses.forEach(address => {
			if (!address.toLowerCase().startsWith('team' + year + '@')) {
				if (!mailPermissions.find(permission => permission.permission.toLowerCase().split('.')[1] === address.toLowerCase().split('@')[0])) {
					res.status(403).send('forbidden to send to this addresses')
					allowed = false;
				}
			}
		})
		if (!allowed) return;
	}
	const user = await userModel.findByPk(req.kauth.grant.access_token.content.sub)
	const messageData = {
		from: user.firstName + ' ' + user.lastName + ' <' + user.mail + '>',
		to: addresses.toString(),
		bcc: user.mail,
		subject: req.body.subject,
		html: req.body.content,
		text: convert(req.body.content),
		'h:Reply-To': user.mail
	};
	mg.messages.create('verteiler.lippesola.de', messageData)
	.then((mgRes) => {
		res.status(200).send('mail sent');
		return;
	})
	.catch((err) => {
		console.error(err);
	});}

export async function addToMailinglist(mailingList, uuids) {
	if (!Array.isArray(uuids)) {
		uuids = [uuids];
	}
	uuids.forEach(async (uuid) => {
		console.log(uuid);
		const user = await userModel.findByPk(uuid);
		console.log(user);
		if (!user) return;
		mg.lists.members.createMember(mailingList, {
			address: user.mail || '',
			name: user.firstName || '' + ' ' + user.lastName || '',
			subscribed: 'yes',
			upsert: 'yes'
		})
		.then(data => console.log(data))
		.catch(err => console.error(err));
	})
}

export async function addToTeamMailinglist(uuids, year) {
	addToMailinglist('team' + year + '@' + (process.env.MAIL_LIST_DOMAIN || 'verteiler.lippesola.de'), uuids);
}

export async function sendMailToUser(uuid, type) {
	const user = await userModel.findByPk(uuid);
	const mailConfiguration = await mailModel.findByPk(type);
	let transporter = nodemailer.createTransport({
		host: mail.mailer.host,
		port: mail.mailer.port,
		secure: false,
		auth: {
			user: mail.mailer.user,
			pass: mail.mailer.pass
		}
	});

	let html = mailConfiguration.text;
	html = html.replace('{{firstName}}', user.firstName);
	html = html.replace('{{lastName}}', user.lastName);
	let text = convert(html);

	let info = await transporter.sendMail({
		from: '"LAMA" <' + mail.mailer.from + '>',
		to: user.mail,
		bcc: mail.mailer.bcc,
		subject: mailConfiguration.subject,
		text: text,
		html: html
	});

	console.log(info);
}