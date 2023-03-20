import { DataTypes } from 'sequelize';
import sequelize from './db.model.js';

export default sequelize.define('Responsibility', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: true,
      notEmpty: true
    }
  },
  uuid: {
    type: DataTypes.UUID,
    references: {
        model: 'Users',
        key: 'uuid'
    }
  },
});