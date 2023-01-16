import { DataTypes } from 'sequelize';
import sequelize from './db.model.js';

export default sequelize.define('UserEngagement', {
  uuid: {
    type: DataTypes.UUID,
    primaryKey: true
  },
  year: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  type: {
    type: DataTypes.TINYINT
  },
  status: {
    type: DataTypes.TINYINT
  },
  build: {
    type: DataTypes.TINYINT
  },
  cleanup: {
    type: DataTypes.TINYINT
  },
  teens: {
    type: DataTypes.TINYINT
  },
  kids: {
    type: DataTypes.TINYINT
  },
  prepare1: {
    type: DataTypes.TINYINT
  },
  prepare2: {
    type: DataTypes.TINYINT
  },
  prepare3: {
    type: DataTypes.TINYINT
  },
  training: {
    type: DataTypes.TINYINT
  },
  driver: {
    type: DataTypes.TINYINT
  },
  groupLeader: {
    type: DataTypes.TINYINT
  },
  trainer: {
    type: DataTypes.TINYINT
  },
  dayLeader: {
    type: DataTypes.TINYINT
  },
  dayTeamLeader: {
    type: DataTypes.TINYINT
  },
  guitar: {
    type: DataTypes.TINYINT
  },
  singing: {
    type: DataTypes.TINYINT
  },
  band: {
    type: DataTypes.TINYINT
  },
  drama: {
    type: DataTypes.TINYINT
  },
  wishTent: {
    type: DataTypes.TINYINT
  },
  wishKitchen: {
    type: DataTypes.TINYINT
  },
  wishOffice: {
    type: DataTypes.TINYINT
  },
  wishMedia: {
    type: DataTypes.TINYINT
  },
  wishMedic: {
    type: DataTypes.TINYINT
  },
  wishInfrastructure: {
    type: DataTypes.TINYINT
  },
  wishOther: {
    type: DataTypes.TINYINT
  }
});