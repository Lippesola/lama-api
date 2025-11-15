import express from 'express'
import fileupload from 'express-fileupload'
import cors from 'cors'
import sequelize from './src/models/db.model.js';

const app = express();

async function initSequelize() {
	try {
		await sequelize.authenticate();
		console.log('Connection has been established successfully.');
		await sequelize.sync({ alter: true });
		console.log('All models were synchronized successfully.');
	  
	  } catch (error) {
		console.error('Unable to connect to the database:', error);
		setTimeout(initSequelize, 5000)
	  }	
}

let origin = process.env.ORIGIN_URL || "";
if (origin) {
	try {
		origin = JSON.parse(origin);
	} catch (e) {
		origin = [origin];
	}
} else {
	origin = [];
}
origin.push(process.env.LAMA_APP_URL || "http://localhost:9000");
var corsOptions = {
  origin: origin,
};

app.use(cors(corsOptions));

app.use(fileupload())

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// unprotected routes
import { registration } from './src/controllers/registration.controller.js';
import { findAll as getAllEvents } from './src/controllers/event.controller.js';
import { findAll as getAllSettings } from './src/controllers/setting.controller.js';
import { create as createSupporterYear } from './src/controllers/supporterYear.controller.js';
import { findOne, create } from './src/controllers/mailingListToken.controller.js';

app.get("/", (req, res) => {res.json({ message: "up" });});
app.post('/registration', registration)
app.get('/event', getAllEvents);
app.get('/setting', getAllSettings);
app.post('/supporterYear', createSupporterYear)
app.get('/mailingListToken/:token', findOne)
app.post('/mailingListToken', create)

// protected routes
import keycloak from './src/config/keycloak.js'
app.use(keycloak.middleware())

import avatarRouter from './src/routes/avatar.route.js'
import eventRouter from './src/routes/event.route.js'
import featureRouter from './src/routes/feature.route.js'
import motivationRouter from './src/routes/motivation.route.js'
import settingRouter from './src/routes/setting.route.js'
import responsibilityRouter from './src/routes/responsibility.route.js'
import mailRouter from './src/routes/mail.route.js'
import mailinglistRouter from './src/routes/mailinglist.route.js'
import miscRouter from './src/routes/misc.route.js'
import supporterYearRouter from './src/routes/supporterYear.route.js'
import userRouter from './src/routes/user.route.js'
import userCriminalRecordRouter from './src/routes/userCriminalRecord.route.js'
import userMotivationRouter from './src/routes/userMotivation.route.js'
import userCommentRouter from './src/routes/userComment.route.js'
import userDocumentRouter from './src/routes/userDocument.route.js'
import userPermissionRouter from './src/routes/userPermission.route.js'
import userYearRouter from './src/routes/userYear.route.js'
import participatorRouter from './src/routes/participator.route.js'
import participatorQuestionRouter from './src/routes/participatorQuestion.route.js'
import participatorQuestionCategoryRouter from './src/routes/participatorQuestionCategory.route.js';
import groupRouter from './src/routes/group.route.js'
import groupUserRouter from './src/routes/groupUser.route.js'
import preferenceRouter from './src/routes/preference.route.js'

import threadRouter from './src/routes/thread.route.js'
import postRouter from './src/routes/post.route.js'
import userPostRouter from './src/routes/userPost.route.js'

import userModel from './src/models/user.model.js';
import userYearModel from './src/models/userYear.model.js';
import responsibilityModel from './src/models/responsibility.model.js';

import supporterYearModel from './src/models/supporterYear.model.js';
import supporterDayModel from './src/models/supporterDay.model.js';
import userCommentModel from './src/models/userComment.model.js';
import userDocumentModel from './src/models/userDocument.model.js';
import userPermissionModel from './src/models/userPermission.model.js';
import userMotivationModel from './src/models/userMotivation.model.js';

import groupModel from './src/models/group.model.js';
import groupUserModel from './src/models/groupUser.model.js';
import preferenceModel from './src/models/preference.model.js';
import participatorModel from './src/models/participator.model.js';

app.use('/avatar', avatarRouter);
app.use('/event', eventRouter);
app.use('/feature', featureRouter);
app.use('/motivation', motivationRouter);
app.use('/setting', settingRouter);
app.use('/responsibility', responsibilityRouter);
app.use('/mail', mailRouter);
app.use('/mailinglist', mailinglistRouter);
app.use('/misc', miscRouter);
app.use('/user', userRouter);
app.use('/supporterYear', supporterYearRouter);
app.use('/userCriminalRecord', userCriminalRecordRouter);
app.use('/userMotivation', userMotivationRouter);
app.use('/userComment', userCommentRouter);
app.use('/userDocument', userDocumentRouter);
app.use('/userPermission', userPermissionRouter);
app.use('/userYear', userYearRouter);
app.use('/participator', participatorRouter);
app.use('/participatorQuestion', participatorQuestionRouter);
app.use('/participatorQuestionCategory', participatorQuestionCategoryRouter);
app.use('/group', groupRouter);
app.use('/groupUser', groupUserRouter);
app.use('/preference', preferenceRouter);

app.use('/thread', threadRouter);
app.use('/post', postRouter);
app.use('/userPost', userPostRouter);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

await initSequelize()


userYearModel.belongsTo(userModel, {as: 'UserModel', foreignKey: 'uuid'})
userModel.hasMany(userYearModel, {foreignKey: 'uuid'})
userYearModel.belongsTo(userModel, {as: 'AssigneeModel', foreignKey: 'assignee'})

userModel.hasMany(responsibilityModel, {foreignKey: 'uuid'})
responsibilityModel.hasOne(userModel, {foreignKey: 'uuid'})

supporterYearModel.hasMany(supporterDayModel, {foreignKey: 'uuid'})
supporterDayModel.hasOne(supporterYearModel, {foreignKey: 'uuid'})

userModel.hasOne(userCommentModel, {foreignKey: 'uuid'})
userCommentModel.hasOne(userModel, {foreignKey: 'uuid'})

userModel.hasOne(userDocumentModel, {foreignKey: 'uuid'})
userDocumentModel.hasOne(userModel, {foreignKey: 'uuid'})

userModel.hasOne(userMotivationModel, {foreignKey: 'uuid'})
userMotivationModel.hasOne(userModel, {foreignKey: 'uuid'})

userModel.hasMany(userPermissionModel, {foreignKey: 'uuid'})
userPermissionModel.hasOne(userModel, {foreignKey: 'uuid'})

groupModel.hasMany(groupUserModel, {foreignKey: 'groupId'})
groupUserModel.hasOne(groupModel, {foreignKey: 'id'})

userModel.hasMany(groupUserModel, {foreignKey: 'uuid', sourceKey: 'uuid'})
groupUserModel.hasOne(userModel, {foreignKey: 'uuid', sourceKey: 'uuid'})

preferenceModel.hasMany(participatorModel, {foreignKey: 'preferenceId'})
participatorModel.hasOne(preferenceModel, {foreignKey: 'id'})

groupModel.hasMany(preferenceModel, {foreignKey: 'groupId'})
preferenceModel.hasOne(groupModel, {foreignKey: 'id'})