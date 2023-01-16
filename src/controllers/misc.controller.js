import kcAdminClient from "../config/keycloak-cli.js";
import UserModel from '../models/user.model.js'

export async function initUsers(req, res) {
	kcAdminClient.users.find({max: 300}).then(function(response) {
		res.status(200).send('Ok')
		response.forEach(function(r) {
			UserModel.create({
				uuid: r.id,
				firstName: r.firstName,
				lastName: r.lastName,
				mail: r.email
			}).catch(function(e){
				console.log(e);
			})
		})
	}).catch(function(e) {
		console.log(e);
	})
}