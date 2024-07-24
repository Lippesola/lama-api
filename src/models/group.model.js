import { DataTypes } from 'sequelize';
import sequelize from './db.model.js';

export default sequelize.define('Group', {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true
  },
  year: {
    type: DataTypes.INTEGER,
  },
  /**
   * 1: teens
   * 2: kids
   */
  week: {
    type: DataTypes.INTEGER,
  },
  groupNumber: {
    type: DataTypes.INTEGER,
  },
  title: {
    type: DataTypes.STRING
  },
  color: {
    type: DataTypes.STRING
  },
  /**
   * 1: tent group
   * 2: infrastructure
   */
  type: {
    type: DataTypes.INTEGER
  }
});