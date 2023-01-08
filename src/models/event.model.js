const { DataTypes } = require('sequelize')
const sequelize = require("./db.model.js")

module.exports = sequelize.define('Event', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  start: {
    type: DataTypes.DATE
  },
  end: {
    type: DataTypes.DATE
  },
  location: {
    type: DataTypes.STRING
  }
});