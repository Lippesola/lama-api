import { DataTypes } from 'sequelize';
import sequelize from './db.model.js';

export default sequelize.define('UserMotivation', {
  uuid: {
    type: DataTypes.UUID,
    primaryKey: true,
    references: {
        model: 'Users',
        key: 'uuid'
    }
  },
  motivation: {
    type: DataTypes.JSON
  }
});