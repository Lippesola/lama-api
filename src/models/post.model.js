import { DataTypes } from 'sequelize';
import sequelize from './db.model.js';

export default sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  threadId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Threads',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  createdBy: {
    type: DataTypes.UUID,
    primaryKey: true,
    references: {
        model: 'Users',
        key: 'uuid'
    },
    onDelete: 'CASCADE'
  },
  text: {
    type: DataTypes.TEXT
  }
});