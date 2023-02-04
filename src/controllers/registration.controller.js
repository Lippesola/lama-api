import kcAdminClient from "../config/keycloak-cli.js";
import userModel from '../models/user.model.js'

export async function registration(req, res) {
	if (!req.body || !req.body.mail || !req.body.firstName || !req.body.lastName) {
		res.status(400).send('bad request')
		return;
	}

	const firstName = req.body.firstName.trim();
	const lastName = req.body.lastName.trim();

	let username = firstName.toLowerCase() + '.' + lastName.toLowerCase()
	username = username.replaceAll('ä', 'ae')
	username = username.replaceAll('ö', 'oe')
	username = username.replaceAll('ü', 'ue')
	username = username.replaceAll('ß', 'ss')
	username = username.replaceAll(' ', '-')

	const password = Math.random().toString(36).slice(-8);

	kcAdminClient.users.create({
		email: req.body.mail,
		firstName: firstName,
		lastName: lastName,
		username: username,
		enabled: true,
		requiredActions: ['VERIFY_EMAIL', 'UPDATE_PASSWORD'],
		credentials: [{
			value: password,
			type: 'password'
		}]
	}).then(function(response) {
		const uuid = response.id
		res.status(200).send({
			uuid: uuid,
			username: username,
			password: password
		})
		let user = userModel.create({
			uuid: uuid,
			firstName: firstName,
			lastName: lastName,
			mail: req.body.mail
		}).catch(function(e) {
			console.log(e);
		})
	}).catch(function(response) {
		res.status(response.response.status).send(response.response.data.errorMessage)
		console.log(response);
	})
}