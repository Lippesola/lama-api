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
app.get("/", (req, res) => {res.json({ message: "up" });});
app.post('/registration', registration)

// protected routes
import keycloak from './src/config/keycloak.js'
app.use(keycloak.middleware())

import avatarRouter from './src/routes/avatar.route.js'
import eventRouter from './src/routes/event.route.js'
import settingRouter from './src/routes/setting.route.js'
import miscRouter from './src/routes/misc.route.js'
import userRouter from './src/routes/user.route.js'
import userEngagementRouter from './src/routes/userEngagement.route.js'
import userMotivation from './src/routes/userMotivation.route.js'
import userTaskRouter from './src/routes/userTask.route.js'
import userYearRouter from './src/routes/userYear.route.js'

app.use('/avatar', avatarRouter);
app.use('/event', eventRouter);
app.use('/setting', settingRouter);
app.use('/misc', miscRouter);
app.use('/user', userRouter);
app.use('/userEngagement', userEngagementRouter);
app.use('/userMotivation', userMotivation);
app.use('/userTask', userTaskRouter);
app.use('/userYear', userYearRouter);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

initSequelize()