// Permission model adapter
const Permiso = require("./sequelize/permiso.model");
const Rol = require("./sequelize/rol.model");

const permisoModelSequelize = {
  getById: async (id) => {
    const permiso = await Permiso.findByPk(id);
    return permiso ? permiso.toJSON() : null;
  },

  getAll: async () => {
    const permisos = await Permiso.findAll();
    return permisos.map(permiso => permiso.toJSON());
  },

  create: async (nombre, descripcion) => {
    try {
      const permiso = await Permiso.create({ nombre, descripcion: descripcion || "" });
      return permiso.toJSON();
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error("Ya existe un permiso con ese nombre");
      }
      throw error;
    }
  },

  update: async (id, nombre, descripcion) => {
    try {
      const [updatedRows] = await Permiso.update(
        { nombre, descripcion: descripcion || "" },
        { where: { id } }
      );
      
      if (updatedRows === 0) {
        return null;
      }
      
      const updatedPermiso = await permisoModelSequelize.getById(id);
      return { ...updatedPermiso, changes: updatedRows };
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error("Ya existe un permiso con ese nombre");
      }
      throw error;
    }
  },

  delete: async (id) => {
    const result = await Permiso.destroy({ where: { id } });
    return { changes: result };
  },

  assignToRole: async (rolId, permisoId) => {
    try {
      const rol = await Rol.findByPk(rolId);
      const permiso = await Permiso.findByPk(permisoId);
      
      if (rol && permiso) {
        await rol.addPermiso(permiso);
        return { changes: 1 };
      }
      return { changes: 0 };
    } catch (error) {
      console.error("Error al asignar permiso a rol:", error.message);
      return { changes: 0 };
    }
  },

  removeFromRole: async (rolId, permisoId) => {
    try {
      const rol = await Rol.findByPk(rolId);
      const permiso = await Permiso.findByPk(permisoId);
      
      if (rol && permiso) {
        await rol.removePermiso(permiso);
        return { changes: 1 };
      }
      return { changes: 0 };
    } catch (error) {
      console.error("Error al remover permiso de rol:", error.message);
      return { changes: 0 };
    }
  },

  getByRolId: async (rolId) => {
    try {
      const rol = await Rol.findByPk(rolId, {
        include: [{
          model: Permiso,
          as: 'permisos'
        }]
      });
      
      return rol ? rol.permisos.map(p => p.toJSON()) : [];
    } catch (error) {
      console.error("Error al obtener permisos por rol:", error.message);
      return [];
    }
  }
};

module.exports = permisoModelSequelize;
