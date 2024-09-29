import mailingListTokenModel from '../models/mailingListToken.model.js'
import { addToMailinglist, sendNewsletterConfirmMail } from './mail.controller.js';
import mail from '../config/mail.js';

function generateToken(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

export async function create (req, res) {
	if (!req.body || !req.body.mail || !req.body.list) {
		res.status(400).send('bad request')
		return;
	}
	if (!mail.subscribeLists.includes(req.body.list)) {
		res.status(403).send('you are not allowed to subscribe to this list')
		return;
	}
	const token = generateToken(32)
	await mailingListTokenModel.create({
		token: token,
		mail: req.body.mail,
		list: req.body.list,
		valid: true
	})
	sendNewsletterConfirmMail(req.body.mail, token)
	res.status(200).send()
}

export async function findOne (req, res) {
	if (!req.params || !req.params.token) {
		res.status(400).send('bad request')
		return;
	}
	const mailingListToken = await mailingListTokenModel.findByPk(req.params.token)
	if (!mailingListToken) {
		res.status(404).send('not found')
		return;
	}
	if (!mailingListToken.valid) {
		res.status(403).send('invalid mailingListToken')
		return;
	}
	if (!mail.subscribeLists.includes(mailingListToken.list)) {
		res.status(403).send('you are not allowed to subscribe to this list')
		return;
	}
	await addToMailinglist(mailingListToken.list, mailingListToken.mail)
	await mailingListToken.update({valid: false})
	res.status(200).send("Du wurdest erfolgreich in den Verteiler eingetragen. Dieses Fenster kann geschlossen werden.")
}