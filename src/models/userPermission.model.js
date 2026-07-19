import { DataTypes } from 'sequelize';
import sequelize from './db.model.js';

export default sequelize.define('UserPermission', {
  uuid: {
    type: DataTypes.UUID,
    primaryKey: true
  },
  permission: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  allowed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});