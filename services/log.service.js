const logModel = require("../models/log.model");

const logService = {
  createLog: async (user_id, endpoint, method, status, message = null) => {
    try {
      return logModel.createLog(user_id, endpoint, method, status, message);
    } catch (error) {
      console.error("Error al crear log:", error);
      // No lanzamos error para no interrumpir el flujo normal de la app
    }
  },

  getAllLogs: async (filters = {}) => {
    return logModel.getAllLogs(filters);
  },

  getLogById: async (id) => {
    return logModel.getLogById(id);
  },

  cleanOldLogs: async (daysToKeep = 30) => {
    return logModel.deleteOldLogs(daysToKeep);
  }
};

module.exports = logService;
