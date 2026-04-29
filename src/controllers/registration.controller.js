import kcAdminClient from "../config/keycloak-cli.js";
import userModel from '../models/user.model.js'

class RegistrationController {
	registration() {
		return async (req, res) => {
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

			let kcResponse
			try {
				kcResponse = await kcAdminClient.users.create({
					email: req.body.mail,
					firstName: firstName,
					lastName: lastName,
					username: username,
					enabled: true,
					requiredActions: ['VERIFY_EMAIL', 'UPDATE_PASSWORD'],
					credentials: [{ value: password, type: 'password' }]
				})
			} catch (e) {
				console.log(e)
				return res.status(e.response?.status ?? 500).send(e.response?.data?.errorMessage)
			}

			const uuid = kcResponse.id
			userModel.create({
				uuid: uuid,
				firstName: firstName,
				lastName: lastName,
				mail: req.body.mail
			}).catch(function(e) { console.log(e); })
			res.status(200).send({ uuid: uuid, username: username, password: password })
		}
	}
}

export default new RegistrationController()
