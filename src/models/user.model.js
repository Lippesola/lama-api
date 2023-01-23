import { DataTypes } from 'sequelize';
import sequelize from './db.model.js';

export default sequelize.define('User', {
  uuid: {
    type: DataTypes.UUID,
    primaryKey: true,
    validate: {
    },
    public: true
  },
  firstName: {
    type: DataTypes.STRING,
    validate: {
    },
    public: true
  },
  lastName: {
    type: DataTypes.STRING,
    validate: {
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
      isIn: [['m', 'w']]
    },
    public: true
  },
  relationship: {
    type: DataTypes.TINYINT,
    validate: {
      isIn: [[0, 1, 2]]
    },
    public: false
  },
  mail: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true
    },
    public: true
  },
  birthday: {
    type: DataTypes.DATE,
    validate: {
      isDate: true,
    },
    public: true
  },
  street: {
    type: DataTypes.STRING,
    validate: {
    },
    public: true
  },
  zipCode: {
    type: DataTypes.INTEGER,
    validate: {
      isNumeric: true,
      len: 5
    },
    public: true
  },
  city: {
    type: DataTypes.STRING,
    validate: {
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
    },
    public: true
  },
  church: {
    type: DataTypes.STRING,
    validate: {
    },
    public: true
  },
  churchContact: {
    type: DataTypes.BOOLEAN,
    validate: {
    },
    public: false
  },
  job: {
    type: DataTypes.STRING,
    validate: {
    },
    public: true
  },
  nutrition: {
    type: DataTypes.STRING,
    validate: {
    },
    public: false
  }
});