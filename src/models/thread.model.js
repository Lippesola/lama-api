import { DataTypes } from 'sequelize';
import sequelize from './db.model.js';

export default sequelize.define('Thread', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING
  }
});