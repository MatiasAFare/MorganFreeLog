const Permiso = require('./sequelize/permiso.model');
const sequelize = require('../config/sequelize');

// Función para inicializar permisos por defecto
const insertDefaultPermisos = async () => {
  const permisos = [
    { nombre: "ADMIN", descripcion: "Permisos varios" },
    { nombre: "SUPER ADMIN", descripcion: "Acceso total a la aplicación" },
    { nombre: "LOGIN", descripcion: "Poder acceder al login" },
    { nombre: "GESTIONAR USUARIOS", descripcion: "Puede crear, editar, eliminar usuarios" },
    { nombre: "GESTIONAR ROLES", descripcion: "Puede crear, editar, eliminar roles" },
    { nombre: "GESTIONAR PERMISOS", descripcion: "Puede crear, editar y eliminar permisos" },
    { nombre: "GESTIONAR ITEMS", descripcion: "Crear productos" },
    { nombre: "GESTIONAR LOGS", descripcion: "Puede ver los logs del sistema" },
  ];
  
  for (const permiso of permisos) {
    try {
      await Permiso.findOrCreate({
        where: { nombre: permiso.nombre },
        defaults: permiso
      });
    } catch (error) {
      console.error(`Error al crear permiso ${permiso.nombre}:`, error.message);
    }
  }
};

const assignDefaultPermissions = async () => {
  try {
    // Asignar todos los permisos al rol administrador (id: 1)
    const permisos = await Permiso.findAll();
    
    for (const permiso of permisos) {
      await sequelize.query(
        "INSERT OR IGNORE INTO rol_permiso (rol_id, permiso_id) VALUES (?, ?)",
        {
          replacements: [1, permiso.id],
          type: sequelize.QueryTypes.INSERT
        }
      );
    }
    
    // Asignar solo LOGIN al rol usuario (id: 2)
    const loginPermiso = await Permiso.findOne({ where: { nombre: 'LOGIN' } });
    if (loginPermiso) {
      await sequelize.query(
        "INSERT OR IGNORE INTO rol_permiso (rol_id, permiso_id) VALUES (?, ?)",
        {
          replacements: [2, loginPermiso.id],
          type: sequelize.QueryTypes.INSERT
        }
      );
    }
  } catch (error) {
    console.error("Error al asignar permisos por defecto:", error.message);
  }
};

const initPermisos = async () => {
  try {
    const count = await Permiso.count();
    if (count === 0) {
      console.log("Semillando permisos por defecto...");
      await insertDefaultPermisos();
      await assignDefaultPermissions();
      console.log("Permisos asignados correctamente.");
    }
  } catch (error) {
    console.error("Error al inicializar permisos:", error.message);
  }
};

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
      await sequelize.query(
        "INSERT OR IGNORE INTO rol_permiso (rol_id, permiso_id) VALUES (?, ?)",
        {
          replacements: [rolId, permisoId],
          type: sequelize.QueryTypes.INSERT
        }
      );
      return { changes: 1 };
    } catch (error) {
      console.error("Error al asignar permiso a rol:", error.message);
      return { changes: 0 };
    }
  },

  removeFromRole: async (rolId, permisoId) => {
    try {
      const result = await sequelize.query(
        "DELETE FROM rol_permiso WHERE rol_id = ? AND permiso_id = ?",
        {
          replacements: [rolId, permisoId],
          type: sequelize.QueryTypes.DELETE
        }
      );
      return { changes: result[1] || 0 };
    } catch (error) {
      console.error("Error al remover permiso de rol:", error.message);
      return { changes: 0 };
    }
  },

  getByRolId: async (rolId) => {
    try {
      const permisos = await sequelize.query(
        `SELECT p.* FROM permisos p
         JOIN rol_permiso rp ON p.id = rp.permiso_id
         WHERE rp.rol_id = ?`,
        {
          replacements: [rolId],
          type: sequelize.QueryTypes.SELECT
        }
      );
      return permisos;
    } catch (error) {
      console.error("Error al obtener permisos por rol:", error.message);
      return [];
    }
  }
};

// Inicializar permisos por defecto
initPermisos();

module.exports = permisoModelSequelize;
