import { DataTypes } from 'sequelize';
import sequelize from './db.model.js';

export default sequelize.define('Feature', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  enabled: {
    type: DataTypes.BOOLEAN,
  }
});