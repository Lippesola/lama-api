import { DataTypes } from 'sequelize';
import sequelize from './db.model.js';

export default sequelize.define('MailingListToken', {
  token: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  list: {
    type: DataTypes.STRING
  },
  mail: {
    type: DataTypes.STRING
  },
  valid: {
    type: DataTypes.BOOLEAN
  }
});