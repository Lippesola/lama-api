import { DataTypes } from 'sequelize';
import sequelize from './db.model.js';

export default sequelize.define('UserYear', {
  uuid: {
    type: DataTypes.UUID,
    primaryKey: true,
    references: {
        model: 'Users',
        key: 'uuid'
    }
  },
  year: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  status: {
    type: DataTypes.INTEGER
  },
  build: {
    type: DataTypes.TINYINT,
    validate: {
      min: 0,
      max: 2
    }
  },
  cleanup: {
    type: DataTypes.TINYINT,
    validate: {
      min: 0,
      max: 2
    }
  },
  teens: {
    type: DataTypes.TINYINT,
    validate: {
      min: 0,
      max: 3
    }
  },
  kids: {
    type: DataTypes.TINYINT,
    validate: {
      min: 0,
      max: 3
    }
  },
  prepare1: {
    type: DataTypes.TINYINT,
    validate: {
      min: 0,
      max: 3
    }
  },
  prepare2: {
    type: DataTypes.TINYINT,
    validate: {
      min: 0,
      max: 3
    }
  },
  prepare3: {
    type: DataTypes.TINYINT,
    validate: {
      min: 0,
      max: 3
    }
  },
  training: {
    type: DataTypes.TINYINT,
    validate: {
      min: 0,
      max: 3
    }
  },
  driver: {
    type: DataTypes.TINYINT,
    validate: {
      min: 0,
      max: 4
    }
  },
  groupLeader: {
    type: DataTypes.TINYINT,
    validate: {
      min: 0,
      max: 1
    }
  },
  trainer: {
    type: DataTypes.TINYINT,
    validate: {
      min: 0,
      max: 1
    }
  },
  dayLeader: {
    type: DataTypes.TINYINT,
    validate: {
      min: 0,
      max: 1
    }
  },
  dayTeamLeader: {
    type: DataTypes.TINYINT,
    validate: {
      min: 0,
      max: 1
    }
  },
  guitar: {
    type: DataTypes.TINYINT,
    validate: {
      min: 0,
      max: 3
    }
  },
  singing: {
    type: DataTypes.TINYINT,
    validate: {
      min: 0,
      max: 1
    }
  },
  band: {
    type: DataTypes.TINYINT,
    validate: {
      min: 0,
      max: 1
    }
  },
  drama: {
    type: DataTypes.TINYINT,
    validate: {
      min: 0,
      max: 2
    }
  },
  wishTent: {
    type: DataTypes.TINYINT,
    validate: {
      min: 0,
      max: 3
    }
  },
  wishKitchen: {
    type: DataTypes.TINYINT,
    validate: {
      min: 0,
      max: 3
    }
  },
  wishOffice: {
    type: DataTypes.TINYINT,
    validate: {
      min: 0,
      max: 3
    }
  },
  wishMedia: {
    type: DataTypes.TINYINT,
    validate: {
      min: 0,
      max: 3
    }
  },
  wishMedic: {
    type: DataTypes.TINYINT,
    validate: {
      min: 0,
      max: 3
    }
  },
  wishInfrastructure: {
    type: DataTypes.TINYINT,
    validate: {
      min: 0,
      max: 3
    }
  },
  wishPrayer: {
    type: DataTypes.TINYINT,
    validate: {
      min: 0,
      max: 3
    }
  },
  wishOther: {
    type: DataTypes.TINYINT,
    validate: {
      min: 0,
      max: 3
    }
  },
  wishOtherText: {
    type: DataTypes.TEXT
  },
  comment: {
    type: DataTypes.TEXT
  }
});