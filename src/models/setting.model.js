const { DataTypes } = require('sequelize')
const sequelize = require("./db.model.js")

module.exports = sequelize.define('Setting', {
  key: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  value: {
    type: DataTypes.STRING
  }
});