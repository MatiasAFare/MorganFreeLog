const db = require("../database");

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
