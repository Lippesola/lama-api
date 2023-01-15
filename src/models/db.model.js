const { Sequelize } = require("sequelize")
const db = require("../config/db.js");

const sequelize = new Sequelize(
  db.DB,
  db.USER,
  db.PASS,
  {
    host: db.HOST,
    dialect: process.env.DB_VENDOR || 'mariadb'
  }
)

module.exports = sequelize;