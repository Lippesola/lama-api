import { DataTypes } from 'sequelize';
import sequelize from './db.model.js';

export default sequelize.define('Motivation', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  type: {
    type: DataTypes.STRING
  },
  prio: {
    type: DataTypes.INTEGER
  },
  content: {
    type: DataTypes.TEXT
  },
  hint: {
    type: DataTypes.TEXT
  },
});