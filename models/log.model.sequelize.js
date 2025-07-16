const Log = require('./sequelize/log.model');
const { Op } = require('sequelize');

const logModelSequelize = {
  createLog: async (user_id, endpoint, method, status, message) => {
    // Asegurar valores por defecto para campos requeridos
    const safeEndpoint = endpoint || '/';
    const safeMethod = method || 'UNKNOWN';
    const safeStatus = status != null ? parseInt(status) : 0;
    const safeMessage = message || '';
    
    const log = await Log.create({
      user_id,
      endpoint: safeEndpoint,
      method: safeMethod,
      status: safeStatus,
      message: safeMessage
    });
    
    return log.toJSON();
  },

  getAllLogs: async (filters = {}) => {
    const where = {};
    
    // Filtros opcionales
    if (filters.user_id) {
      where.user_id = filters.user_id;
    }
    
    if (filters.method) {
      where.method = filters.method;
    }
    
    if (filters.status) {
      where.status = filters.status;
    }
    
    if (filters.endpoint) {
      where.endpoint = { [Op.like]: `%${filters.endpoint}%` };
    }

    const logs = await Log.findAll({
      where,
      order: [['timestamp', 'DESC']],
      limit: 500, // Limitar a los últimos 500 registros
      raw: true // Para obtener objetos planos como en el modelo original
    });

    // Simular los JOINs con users que tenía el modelo original
    // Para mantener compatibilidad, agregar campos user_name y user_email como null
    return logs.map(log => ({
      ...log,
      user_name: null,
      user_email: null
    }));
  },

  getLogById: async (id) => {
    const log = await Log.findByPk(id, { raw: true });
    if (!log) return null;
    
    // Simular el JOIN con users
    return {
      ...log,
      user_name: null,
      user_email: null
    };
  },

  deleteOldLogs: async (daysToKeep = 30) => {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - daysToKeep);
    
    const result = await Log.destroy({
      where: {
        timestamp: {
          [Op.lt]: dateThreshold
        }
      }
    });
    
    return { changes: result };
  }
};

module.exports = logModelSequelize;
