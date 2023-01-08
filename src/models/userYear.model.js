const { DataTypes, UUID } = require('sequelize')
const sequelize = require("./db.model.js")

module.exports = sequelize.define('UserYear', {
  uuid: {
    type: DataTypes.UUID,
    primaryKey: true
  },
  year: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  status: {
    type: DataTypes.INTEGER
  },
  editedBy: {
    type: DataTypes.UUID,
    allowNull: true
  }
});