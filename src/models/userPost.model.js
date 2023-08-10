import { DataTypes } from 'sequelize';
import sequelize from './db.model.js';

export default sequelize.define('UserPost', {
  uuid: {
    type: DataTypes.UUID,
    primaryKey: true,
    references: {
        model: 'Users',
        key: 'uuid'
    },
    onDelete: 'CASCADE'
  },
  postId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Posts',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  like: {
    type: DataTypes.BOOLEAN
  }
});