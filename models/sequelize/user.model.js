// User Sequelize model
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/sequelize');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rol_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: false
});

module.exports = User;
