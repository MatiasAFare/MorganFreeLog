// Role model adapter
const Rol = require("./sequelize/rol.model");
const User = require("./sequelize/user.model");

const rolModelSequelize = {
  getById: async (id) => {
    const rol = await Rol.findByPk(id);
    return rol ? rol.toJSON() : null;
  },

  getAll: async () => {
    const roles = await Rol.findAll();
    return roles.map((rol) => rol.toJSON());
  },

  create: async (nombre) => {
    try {
      const rol = await Rol.create({ nombre });
      return rol.toJSON();
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        throw new Error("Ya existe un rol con ese nombre");
      }
      throw error;
    }
  },

  update: async (id, nombre) => {
    try {
      const [updatedRows] = await Rol.update({ nombre }, { where: { id } });

      if (updatedRows === 0) {
        return null;
      }

      const updatedRol = await rolModelSequelize.getById(id);
      return { ...updatedRol, changes: updatedRows };
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        throw new Error("Ya existe un rol con ese nombre");
      }
      throw error;
    }
  },

  delete: async (id) => {
    const result = await Rol.destroy({ where: { id } });
    return { changes: result };
  },

  getUsersByRolId: async (rolId) => {
    try {
      const rol = await Rol.findByPk(rolId, {
        include: [{
          model: User,
          as: 'usuarios'
        }]
      });
      
      return rol ? rol.usuarios.map(u => u.toJSON()) : [];
    } catch (error) {
      console.error("Error al obtener usuarios por rol:", error.message);
      return [];
    }
  },
};

module.exports = rolModelSequelize;
