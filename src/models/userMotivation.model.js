import { DataTypes } from 'sequelize';
import sequelize from './db.model.js';

export default sequelize.define('UserMotivation', {
  uuid: {
    type: DataTypes.UUID,
    primaryKey: true
  },
  year: {
    type: DataTypes.INTEGER
  },
  hash: {
    type: DataTypes.STRING
  }
});