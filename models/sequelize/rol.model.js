// Role Sequelize model
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/sequelize');

const Rol = sequelize.define('Rol', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'roles',
  timestamps: false
});

module.exports = Rol;
