import { DataTypes } from 'sequelize';
import sequelize from './db.model.js';

export default sequelize.define('Participator', {
  orderId: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  positionId: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
    /**
     * 0: booked (should not be used - fallback)
     * 1: confirmed
     * 2: cancelled
     * 3: waiting list
     */
  },
  preferenceId: {
    type: DataTypes.INTEGER,
    references: {
        model: 'Preferences',
        key: 'id'
    }
  },
});