const { DataTypes } = require('sequelize')
const sequelize = require("./db.model.js")

module.exports = sequelize.define('UserTask', {
  uuid: {
    type: DataTypes.UUID,
    primaryKey: true
  },
  task: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  date: {
    type: DataTypes.DATE
  },
  status: {
    type: DataTypes.TINYINT
  }
});