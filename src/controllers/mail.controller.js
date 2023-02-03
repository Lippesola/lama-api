import mail from '../config/mail.js'
import userModel from '../models/user.model.js';
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import nodemailer from 'nodemailer';


const mailgun = new Mailgun(formData);
const mg = mailgun.client({
	username: mail.mailgun.username,
	key: mail.mailgun.key,
	url: mail.mailgun.url
})


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

export async function sendMail(to, subject, text) {
	let transporter = nodemailer.createTransport({
		host: mail.mailer.host,
		port: mail.mailer.port,
		secure: false,
		auth: {
			user: mail.mailer.user,
			pass: mail.mailer.pass
		}
	});

	let info = await transporter.sendMail({
		from: '"LAMA" <' + mail.mailer.from + '>',
		to: to,
		bcc: mail.mailer.bcc,
		subject: subject,
		text: text
	});

	console.log(info);
}

export async function sendConfirmationMail(uuid) {
	const user = await userModel.findByPk(uuid);
	const subject = 'Du wurdest als Mitarbeiter freigeschaltet!'
	const text = "Hey " + user.firstName + "\n" + 
	"du wurdest gerade für den Mitarbeiter-Bereich freigeschaltet.\n" + 
	"Wenn du willst, kannst du dich direkt unter " + (process.env.LAMA_APP_URL || 'lama.lippesola.de') + " anmelden.\n" +
	"Dort kannst du unter Anderem auch dein Profilbild ändern, damit andere MA dich schneller kennenlernen können.\n\n" + 
	"Danke, dass du dabei bist!\n" + 
	"Dein VB MA"
	sendMail(user.mail, subject, text);
}