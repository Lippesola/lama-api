import { DataTypes } from 'sequelize';
import sequelize from './db.model.js';

export default sequelize.define('UserDocument', {
  uuid: {
    type: DataTypes.UUID,
    primaryKey: true,
    references: {
        model: 'Users',
        key: 'uuid'
    }
  },
  criminalRecord: {
    type: DataTypes.INTEGER
  },
  selfCommitment: {
    type: DataTypes.INTEGER
  }
});