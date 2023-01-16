import { DataTypes } from 'sequelize';
import sequelize from './db.model.js';

export default sequelize.define('User', {
  uuid: {
    type: DataTypes.UUID,
    primaryKey: true
  },
  firstName: {
    type: DataTypes.STRING
  },
  lastName: {
    type: DataTypes.STRING
  },
  nickname: {
    type: DataTypes.STRING
  },
  gender: {
    type: DataTypes.CHAR
  },
  relationship: {
    type: DataTypes.TINYINT
  },
  mail: {
    type: DataTypes.STRING
  },
  birthday: {
    type: DataTypes.DATE
  },
  street: {
    type: DataTypes.STRING
  },
  zipCode: {
    type: DataTypes.INTEGER
  },
  city: {
    type: DataTypes.STRING
  },
  phone: {
    type: DataTypes.STRING
  },
  mobile: {
    type: DataTypes.STRING
  },
  church: {
    type: DataTypes.STRING
  },
  churchContact: {
    type: DataTypes.BOOLEAN
  },
  job: {
    type: DataTypes.STRING
  }
});