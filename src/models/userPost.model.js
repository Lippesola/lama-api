import { DataTypes } from 'sequelize';
import sequelize from './db.model.js';

export default sequelize.define('UserPost', {
  uuid: {
    type: DataTypes.UUID,
    primaryKey: true
  },
  postId: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  like: {
    type: DataTypes.BOOLEAN
  }
});