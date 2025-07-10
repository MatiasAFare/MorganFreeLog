const db = require("../database");

const logModel = {
  createLog: (user_id, endpoint, method, status, message) => {
    // Asegurar valores por defecto para campos requeridos
    const safeEndpoint = endpoint || '/';
    const safeMethod = method || 'UNKNOWN';
    const safeStatus = status != null ? parseInt(status) : 0;
    const safeMessage = message || '';
    
    const stmt = db.prepare(
      "INSERT INTO logs (user_id, endpoint, method, status, message) VALUES (?, ?, ?, ?, ?)"
    );
    return stmt.run(user_id, safeEndpoint, safeMethod, safeStatus, safeMessage);
  },

  getAllLogs: (filters = {}) => {
    let query = `
      SELECT l.*, u.name as user_name, u.email as user_email 
      FROM logs l
      LEFT JOIN users u ON l.user_id = u.id
    `;
    const params = [];
    const whereClauses = [];

    // Filtros opcionales
    if (filters.user_id) {
      whereClauses.push("l.user_id = ?");
      params.push(filters.user_id);
    }
    
    if (filters.method) {
      whereClauses.push("l.method = ?");
      params.push(filters.method);
    }
    
    if (filters.status) {
      whereClauses.push("l.status = ?");
      params.push(filters.status);
    }

    if (whereClauses.length > 0) {
      query += " WHERE " + whereClauses.join(" AND ");
    }

    query += " ORDER BY l.timestamp DESC";
    
    // Limitar a los últimos 500 registros para no sobrecargar
    query += " LIMIT 500";

    const stmt = db.prepare(query);
    return stmt.all(...params);
  },

  getLogById: (id) => {
    const stmt = db.prepare(`
      SELECT l.*, u.name as user_name, u.email as user_email 
      FROM logs l
      LEFT JOIN users u ON l.user_id = u.id
      WHERE l.id = ?
    `);
    return stmt.get(id);
  },

  deleteOldLogs: (daysToKeep = 30) => {
    const stmt = db.prepare(
      "DELETE FROM logs WHERE timestamp < datetime('now', '-' || ? || ' days')"
    );
    return stmt.run(daysToKeep);
  }
};

module.exports = logModel;
