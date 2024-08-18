import { DataTypes } from 'sequelize';
import sequelize from './db.model.js';

export default sequelize.define('Preference', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  groupId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
        model: 'Groups',
        key: 'id'
    }
  }
});