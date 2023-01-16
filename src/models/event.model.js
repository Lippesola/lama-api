import { DataTypes } from 'sequelize';
import sequelize from './db.model.js';

export default sequelize.define('Event', {
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