import { DataTypes } from 'sequelize';
import sequelize from './db.model.js';

export default sequelize.define('UserYear', {
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