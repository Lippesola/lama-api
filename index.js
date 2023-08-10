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

var corsOptions = {
  origin: process.env.LAMA_APP_URL || "http://localhost:9000"
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

app.get("/", (req, res) => {res.json({ message: "up" });});
app.post('/registration', registration)
app.get('/event', getAllEvents);
app.get('/setting', getAllSettings);
app.post('/supporterYear', createSupporterYear)

// protected routes
import keycloak from './src/config/keycloak.js'
app.use(keycloak.middleware())

import avatarRouter from './src/routes/avatar.route.js'
import eventRouter from './src/routes/event.route.js'
import settingRouter from './src/routes/setting.route.js'
import responsibilityRouter from './src/routes/responsibility.route.js'
import mailRouter from './src/routes/mail.route.js'
import mailinglistRouter from './src/routes/mailinglist.route.js'
import miscRouter from './src/routes/misc.route.js'
import supporterYearRouter from './src/routes/supporterYear.route.js'
import userRouter from './src/routes/user.route.js'
import userCriminalRecordRouter from './src/routes/userCriminalRecord.route.js'
import userMotivation from './src/routes/userMotivation.route.js'
import userDocumentRouter from './src/routes/userDocument.route.js'
import userPermissionRouter from './src/routes/userPermission.route.js'
import userYearRouter from './src/routes/userYear.route.js'

import threadRouter from './src/routes/thread.route.js'
import postRouter from './src/routes/post.route.js'
import userPostRouter from './src/routes/userPost.route.js'

import userModel from './src/models/user.model.js';
import userYearModel from './src/models/userYear.model.js';
import responsibilityModel from './src/models/responsibility.model.js';

import supporterYearModel from './src/models/supporterYear.model.js';
import supporterDayModel from './src/models/supporterDay.model.js';
import userDocumentModel from './src/models/userDocument.model.js';
import userPermissionModel from './src/models/userPermission.model.js';

app.use('/avatar', avatarRouter);
app.use('/event', eventRouter);
app.use('/setting', settingRouter);
app.use('/responsibility', responsibilityRouter);
app.use('/mail', mailRouter);
app.use('/mailinglist', mailinglistRouter);
app.use('/misc', miscRouter);
app.use('/user', userRouter);
app.use('/supporterYear', supporterYearRouter);
app.use('/userCriminalRecord', userCriminalRecordRouter);
app.use('/userMotivation', userMotivation);
app.use('/userDocument', userDocumentRouter);
app.use('/userPermission', userPermissionRouter);
app.use('/userYear', userYearRouter);

app.use('/thread', threadRouter);
app.use('/post', postRouter);
app.use('/userPost', userPostRouter);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

await initSequelize()


userModel.hasMany(userYearModel, {foreignKey: 'uuid'})
userYearModel.hasOne(userModel, {foreignKey: 'uuid'})

userModel.hasMany(responsibilityModel, {foreignKey: 'uuid'})
responsibilityModel.hasOne(userModel, {foreignKey: 'uuid'})

supporterYearModel.hasMany(supporterDayModel, {foreignKey: 'uuid'})
supporterDayModel.hasOne(supporterYearModel, {foreignKey: 'uuid'})

userModel.hasOne(userDocumentModel, {foreignKey: 'uuid'})
userDocumentModel.hasOne(userModel, {foreignKey: 'uuid'})

userModel.hasMany(userPermissionModel, {foreignKey: 'uuid'})
userPermissionModel.hasOne(userModel, {foreignKey: 'uuid'})