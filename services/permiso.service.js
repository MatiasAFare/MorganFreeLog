const PermisoModel = require('../models/permiso.model');

const PermisoService = {
    getById: async (id) => {
        return PermisoModel.getById(id);
    },

    getAll: async () => {
        return PermisoModel.getAll();
    },

    create: async (nombre, descripcion) => {
        return PermisoModel.create(nombre, descripcion);
    },

    update: async (id, nombre, descripcion) => {
        return PermisoModel.update(id, nombre, descripcion);
    },

    delete: async (id) => {
        return PermisoModel.delete(id);
    },

    assignToRole: async (rolId, permisoId) => {
        return PermisoModel.assignToRole(rolId, permisoId);
    },

    removeFromRole: async (rolId, permisoId) => {
        return PermisoModel.removeFromRole(rolId, permisoId);
    },

    getByRolId: async (rolId) => {
        return PermisoModel.getByRolId(rolId);
    },

    updateRolPermisos: async (rolId, permisoIds) => {
        if (!Array.isArray(permisoIds)) {
            permisoIds = permisoIds ? [permisoIds] : [];
        }

        permisoIds = permisoIds.map(id => Number(id));

        const currentPermisos = await PermisoModel.getByRolId(rolId);
        const currentIds = currentPermisos.map(p => p.id);

        for (const id of currentIds) {
            if (!permisoIds.includes(id)) {
                await PermisoModel.removeFromRole(rolId, id);
            }
        }

        for (const id of permisoIds) {
            await PermisoModel.assignToRole(rolId, id);
        }

        return PermisoModel.getByRolId(rolId);
    }
};

module.exports = PermisoService;