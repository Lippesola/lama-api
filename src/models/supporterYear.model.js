import { DataTypes } from 'sequelize';
import sequelize from './db.model.js';

export default sequelize.define('SupporterYear', {
  uuid: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    validate: {
      notEmpty: true,
    }
  },
  firstName: {
    type: DataTypes.STRING,
    validate: {
      notEmpty: true,
    }
  },
  lastName: {
    type: DataTypes.STRING,
    validate: {
      notEmpty: true,
    }
  },
  gender: {
    type: DataTypes.CHAR,
    validate: {
      notEmpty: true,
      isIn: [['m', 'w']]
    }
  },
  mail: {
    type: DataTypes.STRING,
    validate: {
      notEmpty: true,
      isEmail: true
    }
  },
  birthday: {
    type: DataTypes.DATE,
    validate: {
      notEmpty: true,
      isDate: true,
    }
  },
  street: {
    type: DataTypes.STRING,
    validate: {
      notEmpty: true,
    }
  },
  zipCode: {
    type: DataTypes.INTEGER,
    validate: {
      notEmpty: true,
      isNumeric: true,
      len: 5
    }
  },
  city: {
    type: DataTypes.STRING,
    validate: {
      notEmpty: true,
    }
  },
  phone: {
    type: DataTypes.STRING,
    validate: {}
  },
  mobile: {
    type: DataTypes.STRING,
    validate: {
      notEmpty: true,
    }
  },
  church: {
    type: DataTypes.STRING,
    validate: { }
  },
  job: {
    type: DataTypes.STRING,
    validate: {
      notEmpty: true,
    }
  },
  vegetarian: {
    type: DataTypes.BOOLEAN,
    validate: {}
  },
  lactose: {
    type: DataTypes.BOOLEAN,
    validate: {}
  },
  supportTypeDriverCar: {
    type: DataTypes.BOOLEAN,
    validate: {}
  },
  supportTypeDriverTrailer: {
    type: DataTypes.BOOLEAN,
    validate: {}
  },
  supportTypeDriverTruck: {
    type: DataTypes.BOOLEAN,
    validate: {}
  },
  supportTypeVehicleTrailer: {
    type: DataTypes.BOOLEAN,
    validate: {}
  },
  supportTypeVehicleCar: {
    type: DataTypes.BOOLEAN,
    validate: {}
  },
  supportTypeVehicleVan: {
    type: DataTypes.BOOLEAN,
    validate: {}
  },
  supportTypeTasks: {
    type: DataTypes.BOOLEAN,
    validate: {}
  },
  supportTypeDeco: {
    type: DataTypes.BOOLEAN,
    validate: {}
  },
  supportTypeMaterial: {
    type: DataTypes.BOOLEAN,
    validate: {}
  },
  supportTypeTraining: {
    type: DataTypes.BOOLEAN,
    validate: {}
  },
  supportTypeWorkshops: {
    type: DataTypes.BOOLEAN,
    validate: {}
  },
  supportTypeSeminars: {
    type: DataTypes.BOOLEAN,
    validate: {}
  },
  supportTypeInfrastructure: {
    type: DataTypes.BOOLEAN,
    validate: {}
  },
  supportTypeKitchen: {
    type: DataTypes.BOOLEAN,
    validate: {}
  },
  supportTypeMedia: {
    type: DataTypes.BOOLEAN,
    validate: {}
  },
  supportTypePrayer: {
    type: DataTypes.BOOLEAN,
    validate: {}
  },
  supportTypeGames: {
    type: DataTypes.BOOLEAN,
    validate: {}
  },
  supportTypeNightwatch: {
    type: DataTypes.BOOLEAN,
    validate: {}
  },
  supportTypeOther: {
    type: DataTypes.BOOLEAN,
    validate: {}
  }
  
});