const express = require("express");
const fileupload = require('express-fileupload')
const cors = require("cors");
const sequelize = require("./src/models/db.model")

const app = express();

async function initSequelize() {
	try {
		await sequelize.authenticate();
		console.log('Connection has been established successfully.');
		await sequelize.sync({ alter: true });
		console.log('All models were synchronized successfully.');
	  
	  } catch (error) {
		console.error('Unable to connect to the database:', error);
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

// simple route
app.get("/", (req, res) => {
  res.json({ message: "up" });
});

const keycloak = require('./src/config/keycloak.js').initKeycloak();
app.use(keycloak.middleware());

require("./src/routes/avatar.route.js")(app);
require("./src/routes/event.route.js")(app);
require("./src/routes/user.route.js")(app);
require("./src/routes/userEngagement.route.js")(app);
require("./src/routes/userTask.route.js")(app); 
require("./src/routes/userYear.route.js")(app); 
require("./src/routes/setting.route.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

initSequelize()