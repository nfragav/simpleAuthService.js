const { Sequelize, DataTypes } = require('sequelize')
const {
  DB_NAME_FOR_APP,
  DB_USER_FOR_APP,
  DB_PASS_FOR_APP,
  DB_HOST,
  DB_PORT
} = process.env

console.log(DB_NAME_FOR_APP)
console.log(DB_USER_FOR_APP)
console.log(DB_PASS_FOR_APP)

const sequelize = new Sequelize(
  DB_NAME_FOR_APP,
  DB_USER_FOR_APP,
  DB_PASS_FOR_APP,
  {
    host: DB_HOST,
    dialect: 'postgres',
    port: DB_PORT
  }
)

try {
  sequelize.authenticate()
  console.log('Connection has been established successfully.')
} catch (error) {
  console.error('Unable to connect to the database:', error)
}

const User = sequelize.define('user', {
  uuid: {
    type: DataTypes.UUIDV4
  },
  username: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  verified: {
    type: DataTypes.BOOLEAN
  }
}, {
  timestamps: false
})

module.exports = { User }
