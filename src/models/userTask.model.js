import { DataTypes } from 'sequelize';
import sequelize from './db.model.js';

export default sequelize.define('UserTask', {
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