import { DataTypes } from 'sequelize';
import sequelize from './db.model.js';

export default sequelize.define('Setting', {
  key: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  value: {
    type: DataTypes.STRING
  }
});