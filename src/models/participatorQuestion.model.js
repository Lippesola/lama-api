import { DataTypes } from 'sequelize';
import sequelize from './db.model.js';

export default sequelize.define('ParticipatorQuestion', {
  id: {
    type: DataTypes.STRING,
    autoIncrement: false,
    primaryKey: true
  },
  referId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  label: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
        model: 'ParticipatorQuestionCategories',
        key: 'id'
    }
  },
});