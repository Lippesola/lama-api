import { DataTypes } from 'sequelize';
import sequelize from './db.model.js';

export default sequelize.define('ParticipatorQuestionCategory', {
  id: {
    type: DataTypes.STRING,
    autoIncrement: false,
    primaryKey: true
  },
  label: {
    type: DataTypes.STRING,
    allowNull: false
  },
});