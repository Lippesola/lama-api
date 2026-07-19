import { DataTypes } from 'sequelize';
import sequelize from './db.model.js';

export default sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  threadId: {
    type: DataTypes.INTEGER
  },
  createdBy: {
    type: DataTypes.UUID,
    primaryKey: true
  },
  text: {
    type: DataTypes.TEXT
  }
});