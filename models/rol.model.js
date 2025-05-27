const db = require("../database");

const insertDefaultRoles = () => {
  const roles = ["administrador", "usuario"];
  const stmt = db.prepare("INSERT OR IGNORE INTO roles (nombre) VALUES (?)");
  roles.forEach((rol) => {
    stmt.run(rol);
  });
};
insertDefaultRoles();

const RolModel = {
  getById: (id) => {
    const stmt = db.prepare("SELECT * FROM roles WHERE id = ?");
    return stmt.get(id);
  },

  getAll: () => {
    const stmt = db.prepare("SELECT * FROM roles");
    return stmt.all();
  },

  create: (nombre) => {
    try {
      const stmt = db.prepare("INSERT INTO roles (nombre) VALUES (?)");
      const result = stmt.run(nombre);
      return { id: result.lastInsertRowid, nombre };
    } catch (error) {
      if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
        throw new Error("Ya existe un rol con ese nombre");
      }
      throw error;
    }
  },

  update: (id, nombre) => {
    try {
      const stmt = db.prepare("UPDATE roles SET nombre = ? WHERE id = ?");
      const result = stmt.run(nombre, id);
      return { id, nombre, changes: result.changes };
    } catch (error) {
      if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
        throw new Error("Ya existe un rol con ese nombre");
      }
      throw error;
    }
  },

  delete: (id) => {
    const stmt = db.prepare("DELETE FROM roles WHERE id = ?");
    const result = stmt.run(id);
    return { changes: result.changes };
  },

  getUsersByRolId: (rolId) => {
    const stmt = db.prepare("SELECT * FROM users WHERE rol_id = ?");
    return stmt.all(rolId);
  },
};

module.exports = RolModel;
