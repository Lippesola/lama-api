import { DataTypes } from 'sequelize';
import sequelize from './db.model.js';

export default sequelize.define('User', {
  uuid: {
    type: DataTypes.UUID,
    primaryKey: true,
    validate: {
      notEmpty: true,
    },
    public: true
  },
  firstName: {
    type: DataTypes.STRING,
    validate: {
      notEmpty: true,
    },
    public: true
  },
  lastName: {
    type: DataTypes.STRING,
    validate: {
      notEmpty: true,
    },
    public: true
  },
  nickname: {
    type: DataTypes.STRING,
    validate: {

    },
    public: true
  },
  gender: {
    type: DataTypes.CHAR,
    validate: {
      notEmpty: true,
      isIn: [['m', 'w']]
    },
    public: true
  },
  relationship: {
    type: DataTypes.TINYINT,
    validate: {
      notEmpty: true,
      isIn: [[0, 1, 2]]
    },
    public: false
  },
  mail: {
    type: DataTypes.STRING,
    validate: {
      notEmpty: true,
      isEmail: true
    },
    public: true
  },
  birthday: {
    type: DataTypes.DATE,
    validate: {
      notEmpty: true,
      isDate: true,
    },
    public: true
  },
  street: {
    type: DataTypes.STRING,
    validate: {
      notEmpty: true,
    },
    public: true
  },
  zipCode: {
    type: DataTypes.INTEGER,
    validate: {
      notEmpty: true,
      isNumeric: true,
      len: 5
    },
    public: true
  },
  city: {
    type: DataTypes.STRING,
    validate: {
      notEmpty: true,
    },
    public: true
  },
  phone: {
    type: DataTypes.STRING,
    validate: {
      
    },
    public: true
  },
  mobile: {
    type: DataTypes.STRING,
    validate: {
      notEmpty: true,
    },
    public: true
  },
  church: {
    type: DataTypes.STRING,
    validate: {
      notEmpty: true,
    },
    public: true
  },
  churchContact: {
    type: DataTypes.BOOLEAN,
    validate: {
      notEmpty: true,
    },
    public: false
  },
  job: {
    type: DataTypes.STRING,
    validate: {
      notEmpty: true,
    },
    public: true
  },
  nutrition: {
    type: DataTypes.STRING,
    public: false
  }
});