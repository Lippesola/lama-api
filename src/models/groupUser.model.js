import { DataTypes } from 'sequelize';
import sequelize from './db.model.js';

export default sequelize.define('GroupUser', {
  groupId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
        model: 'Groups',
        key: 'id'
    }
  },
  uuid: {
    primaryKey: true,
    type: DataTypes.UUID,
    references: {
        model: 'Users',
        key: 'uuid'
    }
  },
  /**
   * 1: Team
   * 2: Leader
   */
  type: {
    type: DataTypes.INTEGER
  },
});