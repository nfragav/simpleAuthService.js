const {Sequelize, DataTypes} = require('sequelize');
const {
  DB_NAME_FOR_APP,
  DB_USER_FOR_APP,
  DB_PASS_FOR_APP,
  DB_HOST,
  DB_PORT,
} = process.env;

const sequelize = new Sequelize(
    DB_NAME_FOR_APP,
    DB_USER_FOR_APP,
    DB_PASS_FOR_APP,
    {
      host: DB_HOST,
      dialect: 'postgres',
      port: DB_PORT,
    },
);

try {
  sequelize.authenticate();
} catch (error) {
  error(error);
}

const User = sequelize.define('user', {
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  username: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  hashedEmail: {
    field: 'hashed_email',
    type: DataTypes.TEXT,
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  verified: {
    type: DataTypes.BOOLEAN,
  },
}, {
  timestamps: false,
});

module.exports = {User};
