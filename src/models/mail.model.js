import { DataTypes } from 'sequelize';
import sequelize from './db.model.js';

export default sequelize.define('Mail', {
  key: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  subject: {
    type: DataTypes.STRING
  },
  text: {
    type: DataTypes.TEXT
  }
});