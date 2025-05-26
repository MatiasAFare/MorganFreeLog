const RolModel = require('../models/rol.model');

const RolService = {
    getById: async (id) => {
        return RolModel.getById(id);
    },

    getAll: async () => {
        return RolModel.getAll();
    },

    create: async (nombre) => {
        return RolModel.create(nombre);
    },

    update: async (id, nombre) => {
        return RolModel.update(id, nombre);
    },

    delete: async (id) => {
        return RolModel.delete(id);
    },

    getUsersByRolId: async (rolId) => {
        return RolModel.getUsersByRolId(rolId);
    }
};

module.exports = RolService;