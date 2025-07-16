const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'), // Tu archivo actual
  logging: false // Silenciar logs SQL
});

module.exports = sequelize;
