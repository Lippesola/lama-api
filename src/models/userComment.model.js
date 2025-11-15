import { DataTypes } from 'sequelize';
import sequelize from './db.model.js';

export default sequelize.define('UserComment', {
  uuid: {
    type: DataTypes.UUID,
    primaryKey: true,
    references: {
        model: 'Users',
        key: 'uuid'
    }
  },
  comment: {
    type: DataTypes.TEXT
  },
});