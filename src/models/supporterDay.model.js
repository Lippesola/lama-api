import { DataTypes } from 'sequelize';
import sequelize from './db.model.js';

export default sequelize.define('SupporterDay', {
  uuid: {
    type: DataTypes.UUID,
    primaryKey: true,
    references: {
        model: 'SupporterYears',
        key: 'uuid'
    }
  },
  day: {
    type: DataTypes.DATEONLY,
    primaryKey: true
  },
  status: {
    type: DataTypes.INTEGER
  },
});