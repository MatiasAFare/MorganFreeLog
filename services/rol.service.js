const RolModel = require('../models/rol.model.sequelize');

const RolService = {
  getById: async (id) => {
    return await RolModel.getById(id);
  },

  getAll: async () => {
    return await RolModel.getAll();
  },

  create: async (nombre) => {
    return await RolModel.create(nombre);
  },

  update: async (id, nombre) => {
    return await RolModel.update(id, nombre);
  },

  delete: async (id) => {
    return await RolModel.delete(id);
  },

  getUsersByRolId: async (rolId) => {
    return await RolModel.getUsersByRolId(rolId);
  },
};

module.exports = RolService;
