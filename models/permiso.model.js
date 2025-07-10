const db = require("../database");

const insertDefaultPermisos = () => {
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
  const stmt = db.prepare(
    "INSERT OR IGNORE INTO permisos (nombre, descripcion) VALUES (?, ?)"
  );
  permisos.forEach((permiso) => {
    stmt.run(permiso.nombre, permiso.descripcion);
  });
};

const initPermisos = () => {
  const permisosCount = db.prepare("SELECT COUNT(*) as count FROM permisos").get();
  if (permisosCount.count === 0) {
    console.log("Semillando permisos por defecto...");
    insertDefaultPermisos();
    
    // Asignar todos los permisos al rol administrador (id: 1)
    console.log("Asignando permisos al rol administrador...");
    const permisos = db.prepare("SELECT id FROM permisos").all();
    const assignStmt = db.prepare("INSERT OR IGNORE INTO rol_permiso (rol_id, permiso_id) VALUES (?, ?)");
    
    permisos.forEach((permiso) => {
      assignStmt.run(1, permiso.id); // Asignar al rol administrador (id: 1)
    });
    
    // Asignar solo LOGIN al rol usuario (id: 2)
    const loginPermiso = db.prepare("SELECT id FROM permisos WHERE nombre = 'LOGIN'").get();
    if (loginPermiso) {
      assignStmt.run(2, loginPermiso.id); // Asignar al rol usuario (id: 2)
    }
    
    console.log("Permisos asignados correctamente.");
  }
};
initPermisos();


const PermisoModel = {
  getById: (id) => {
    const stmt = db.prepare("SELECT * FROM permisos WHERE id = ?");
    return stmt.get(id);
  },

  getAll: () => {
    const stmt = db.prepare("SELECT * FROM permisos");
    return stmt.all();
  },

  create: (nombre, descripcion) => {
    try {
      const stmt = db.prepare(
        "INSERT INTO permisos (nombre, descripcion) VALUES (?, ?)"
      );
      const result = stmt.run(nombre, descripcion || "");
      return { id: result.lastInsertRowid, nombre, descripcion };
    } catch (error) {
      if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
        throw new Error("Ya existe un permiso con ese nombre");
      }
      throw error;
    }
  },

  update: (id, nombre, descripcion) => {
    try {
      const stmt = db.prepare(
        "UPDATE permisos SET nombre = ?, descripcion = ? WHERE id = ?"
      );
      const result = stmt.run(nombre, descripcion || "", id);
      return { id, nombre, descripcion, changes: result.changes };
    } catch (error) {
      if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
        throw new Error("Ya existe un permiso con ese nombre");
      }
      throw error;
    }
  },

  delete: (id) => {
    const stmt = db.prepare("DELETE FROM permisos WHERE id = ?");
    const result = stmt.run(id);
    return { changes: result.changes };
  },

  assignToRole: (rolId, permisoId) => {
    const stmt = db.prepare(
      "INSERT OR IGNORE INTO rol_permiso (rol_id, permiso_id) VALUES (?, ?)"
    );
    const result = stmt.run(rolId, permisoId);
    return { changes: result.changes };
  },

  removeFromRole: (rolId, permisoId) => {
    const stmt = db.prepare(
      "DELETE FROM rol_permiso WHERE rol_id = ? AND permiso_id = ?"
    );
    const result = stmt.run(rolId, permisoId);
    return { changes: result.changes };
  },

  getByRolId: (rolId) => {
    const stmt = db.prepare(`
            SELECT p.* FROM permisos p
            JOIN rol_permiso rp ON p.id = rp.permiso_id
            WHERE rp.rol_id = ?
        `);
    return stmt.all(rolId);
  },
};

module.exports = PermisoModel;
