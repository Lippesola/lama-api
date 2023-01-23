import Sequelize from "sequelize";
import db from '../config/db.js'
 
const sequelize = new Sequelize(
  db.DB,
  db.USER,
  db.PASS,
  {
    host: db.HOST,
    dialect: process.env.DB_VENDOR || 'mariadb'
  }
)

export default sequelize;