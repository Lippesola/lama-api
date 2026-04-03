import mailModel from '../models/mail.model.js'
import mail from '../config/mail.js'
import userModel from '../models/user.model.js';
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import nodemailer from 'nodemailer';
import settingModel from "../models/setting.model.js";
import { convert } from 'html-to-text';
import userPermissionModel from '../models/userPermission.model.js';
import { findOne as findOneParticipator } from './participator.controller.js'
import { Op } from 'sequelize';
import { createDocument, getHeader, getParticipatorConfirmation, getSidebar } from './document.controller.js';
import supporterYearModel from '../models/supporterYear.model.js';
import supporterDayModel from '../models/supporterDay.model.js';
import BaseController from './base.controller.js'
import { isLT, getTokenContent } from '../middleware/auth.js'

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
	username: mail.mailgun.username,
	key: mail.mailgun.key,
	url: mail.mailgun.url
})

class MailController extends BaseController {
	constructor() {
		super({ model: mailModel, paramKey: 'key' })
	}

	findAllMailinglists() {
		return async (req, res) => {
			const lists = (await mg.lists.list()).items
			const year = (await settingModel.findByPk('currentYear')).value
			if (isLT(req)) {
				res.status(200).send(lists)
				return;
			}
			var ret = lists.filter(list => list.address.toLowerCase().startsWith('team' + year + '@'))
			const mailPermissions = await userPermissionModel.findAll({
				where: {
					uuid: getTokenContent(req).sub,
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
	}

	sendMail() {
		return async (req, res) => {
			if (!req.body || !req.body.addresses.length || !req.body.subject || req.body.content === '<br>') {
				let missingKeys = []
				if (!req.body.addresses.length) missingKeys.push('addresses')
				if (!req.body.subject) missingKeys.push('subject')
				if (req.body.content == '<br>') missingKeys.push('content')
				res.status(400).send(missingKeys)
				return;
			}
			const year = (await settingModel.findByPk('currentYear')).value
			const addresses = req.body.addresses
			if (!isLT(req)) {
				const mailPermissions = await userPermissionModel.findAll({
					where: {
						uuid: getTokenContent(req).sub,
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
			const user = await userModel.findByPk(getTokenContent(req).sub)
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
			});
		}
	}
}

export default new MailController()

// Standalone utility functions — importiert von anderen Controllern (kein req/res)

export function listDomains() {
	mg.domains.list()
	.then(data => console.log(data))
	.catch(err => console.error(err));
}

export async function addToMailinglist(mailingList, uuids) {
	if (!Array.isArray(uuids)) {
		uuids = [uuids];
	}
	uuids.forEach(async (uuid) => {
		console.log(uuid);
		let user = {};
		if (uuid.includes('@')) {
			user = { mail: uuid }
		} else {
			user = await userModel.findByPk(uuid);
		}
		console.log(user);
		if (!user.mail) return;
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

export async function addToSupportMailinglist(mail, year) {
	addToMailinglist('helfer' + year + '@' + (process.env.MAIL_LIST_DOMAIN || 'verteiler.lippesola.de'), mail);
}

export async function sendNewsletterConfirmMail(mailAddress, token) {
	const confirmLink = process.env.LAMA_API_URL + '/mailingListToken/' + token;
	const html = '<p>'
		+ 'Vielen Dank für deine Anmeldung zum Lippesola Newsletter.<br>'
		+ 'Bitte bestätige deine Anmeldung durch Klick auf den folgenden Link: <br>'
		+ '<a href="' + confirmLink + '">' + confirmLink + '</a>'
		+ '</p>'
		+ '<p>'
		+ 'Solltest du keine Anmeldung vorgenommen haben, kannst du diese E-Mail ignorieren.'
		+ '</p>';
	const transporter = nodemailer.createTransport({
		host: mail.default.host,
		port: mail.default.port,
		secure: mail.default.secure,
		auth: {
			user: mail.default.user,
			pass: mail.default.pass
		}
	});
	transporter.sendMail({
		from: '"Lippesola Newsletter" <' + mail.default.from + '>',
		to: mailAddress,
		subject: 'Newsletter Anmeldung bestätigen',
		text: convert(html),
		html: html
	});
}

export async function sendMailToParents(orderId, positionId, type) {
	const participator = await findOneParticipator({params: {
		orderId: orderId,
		positionId: positionId
	}});
	const mailConfiguration = await mailModel.findByPk(type);
	let html = mailConfiguration.text;
	html = html.replaceAll('{{parentLastName}}', participator.parentLastName);
	html = html.replaceAll('{{participatorFirstName}}', participator.firstName);
	html = html.replaceAll('{{participatorLastName}}', participator.lastName);
	const transporter = nodemailer.createTransport({
		host: mail.booking.host,
		port: mail.booking.port,
		secure: mail.booking.secure,
		auth: {
			user: mail.booking.user,
			pass: mail.booking.pass
		}
	});
	if (type === 'participatorConfirmation') {
		let buffers = [];
		let doc = createDocument();
		doc.on('data', buffers.push.bind(buffers));
		doc.on('end', () => {
			let pdfData = Buffer.concat(buffers);
			transporter.sendMail({
				from: '"Lippesola Anmeldung" <' + mail.booking.from + '>',
				to: participator.parentMail,
				subject: mailConfiguration.subject,
				text: convert(html),
				html: html,
				attachments: [{
					filename: 'Anmeldebestätigung.pdf',
					content: pdfData,
					contentType: 'application/pdf'
				}]
			});
		});
		getHeader(doc, 'Familie ' + participator.lastName + '\n' + participator.street + '\n' + participator.zipCode + ' ' + participator.city)
		getParticipatorConfirmation(doc, participator)
		await getSidebar(doc)
		doc.end();
	} else {
		transporter.sendMail({
			from: '"Lippesola Anmeldung" <' + mail.booking.from + '>',
			to: participator.parentMail,
			subject: mailConfiguration.subject,
			text: convert(html),
			html: html
		});
	}
}

export async function sendMailToUser(uuid, type, userType = 'user') {
	let user;
	if (userType === 'supporter') {
		user = await supporterYearModel.findByPk(uuid);
		type = 'supporter' + type.charAt(0).toUpperCase() + type.slice(1);
	} else {
		user = await userModel.findByPk(uuid);
	}
	const mailConfiguration = await mailModel.findByPk(type);

	let html = mailConfiguration.text;
	html = html.replaceAll('{{firstName}}', user.firstName);
	html = html.replaceAll('{{lastName}}', user.lastName);
	if (userType === 'supporter') {
		const supporterDays = await supporterDayModel.findAll({
			where: { uuid: user.uuid }
		});
		const days = supporterDays.map(element =>
			new Date(element.day).toLocaleDateString('de-DE', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric'
			})
		);
		html = html.replaceAll('{{supporterDays}}', days.length > 0 ? days.join(', ') : 'Keine Termine eingetragen');
		html = html.replaceAll('{{supporterContact}}', user.mail + (user.phone ? ', ' + user.phone : '') + (user.mobile ? ', ' + user.mobile : ''));
	}
	let text = convert(html);
	const transporter = nodemailer.createTransport({
		host: mail.default.host,
		port: mail.default.port,
		secure: mail.default.secure,
		auth: {
			user: mail.default.user,
			pass: mail.default.pass
		}
	});
	let info = await transporter.sendMail({
		from: '"LAMA" <' + mail.default.from + '>',
		to: user.mail,
		bcc: mail.default.bcc,
		subject: mailConfiguration.subject,
		text: text,
		html: html
	});
	console.log(info);
}
