const { DataTypes } = require('sequelize')
const sequelize = require("./db.model.js")

module.exports = sequelize.define('UserMotivation', {
  uuid: {
    type: DataTypes.UUID,
    primaryKey: true
  },
  year: {
    type: DataTypes.INTEGER
  },
  hash: {
    type: DataTypes.STRING
  }
});