const Rol = require('./sequelize/rol.model');

// Función para inicializar roles por defecto
const insertDefaultRoles = async () => {
  const roles = ["administrador", "usuario"];
  
  for (const rolNombre of roles) {
    try {
      await Rol.findOrCreate({
        where: { nombre: rolNombre },
        defaults: { nombre: rolNombre }
      });
    } catch (error) {
      console.error(`Error al crear rol ${rolNombre}:`, error.message);
    }
  }
};

const rolModelSequelize = {
  getById: async (id) => {
    const rol = await Rol.findByPk(id);
    return rol ? rol.toJSON() : null;
  },

  getAll: async () => {
    const roles = await Rol.findAll();
    return roles.map(rol => rol.toJSON());
  },

  create: async (nombre) => {
    try {
      const rol = await Rol.create({ nombre });
      return rol.toJSON();
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error("Ya existe un rol con ese nombre");
      }
      throw error;
    }
  },

  update: async (id, nombre) => {
    try {
      const [updatedRows] = await Rol.update(
        { nombre },
        { where: { id } }
      );
      
      if (updatedRows === 0) {
        return null;
      }
      
      const updatedRol = await rolModelSequelize.getById(id);
      return { ...updatedRol, changes: updatedRows };
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
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
    // Esta función requiere importar User model, pero para evitar dependencia circular
    // la manejaremos desde el service o cuando implementemos las relaciones
    // Por ahora, devolvemos array vacío para mantener compatibilidad
    return [];
  }
};

// Inicializar roles por defecto
insertDefaultRoles();

module.exports = rolModelSequelize;
