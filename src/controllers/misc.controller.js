import kcAdminClient from "../config/keycloak-cli.js";
import userModel from '../models/user.model.js'

export async function initUsers(req, res) {
	const isAdmin = req.kauth.grant.access_token.content.groups.includes('admin')
  
	if (!isAdmin) {
	  return res.status(403).send({
		message: "Forbidden!"
	  });
	}
	kcAdminClient.users.find({max: 300}).then(function(response) {
		res.status(200).send('Ok')
		response.forEach(function(r) {
			userModel.create({
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