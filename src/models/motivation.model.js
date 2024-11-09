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
  showForNew: {
    type: DataTypes.BOOLEAN
  },
  showForExisting: {
    type: DataTypes.BOOLEAN
  },
  showForLeader: {
    type: DataTypes.BOOLEAN
  }
});