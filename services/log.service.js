// Log service
const logModel = require("../models/log.model.sequelize");

const logService = {
  createLog: async (user_id, endpoint, method, status, message = null) => {
    try {
      return await logModel.createLog(user_id, endpoint, method, status, message);
    } catch (error) {
      console.error("Error al crear log:", error);
    }
  },

  getAllLogs: async (filters = {}) => {
    return await logModel.getAllLogs(filters);
  },

  getLogById: async (id) => {
    return await logModel.getLogById(id);
  },
  //TODO: Implementar autoborrado / borrado de logs antiguos
  cleanOldLogs: async (daysToKeep = 30) => {
    return await logModel.deleteOldLogs(daysToKeep);
  }
};

module.exports = logService;
