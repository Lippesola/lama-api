import { DataTypes } from 'sequelize';
import sequelize from './db.model.js';

export default sequelize.define('User', {
  uuid: {
    type: DataTypes.UUID,
    primaryKey: true,
    validate: {
    }
  },
  firstName: {
    type: DataTypes.STRING,
    validate: {
    }
  },
  lastName: {
    type: DataTypes.STRING,
    validate: {
    }
  },
  nickname: {
    type: DataTypes.STRING
  },
  gender: {
    type: DataTypes.CHAR,
    validate: {
      isIn: [['m', 'w']]
    }
  },
  relationship: {
    type: DataTypes.TINYINT,
    validate: {
      isIn: [[0, 1, 2]]
    }
  },
  mail: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true
    }
  },
  birthday: {
    type: DataTypes.DATE,
    validate: {
      isDate: true,
    }
  },
  street: {
    type: DataTypes.STRING,
    validate: {
    }
  },
  zipCode: {
    type: DataTypes.INTEGER,
    validate: {
      isNumeric: true,
      len: 5
    }
  },
  city: {
    type: DataTypes.STRING,
    validate: {
    }
  },
  phone: {
    type: DataTypes.STRING
  },
  mobile: {
    type: DataTypes.STRING,
    validate: {
    }
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