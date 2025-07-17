// Log model adapter
const Log = require("./sequelize/log.model");
const User = require("./sequelize/user.model");
const { Op } = require("sequelize");

const logModelSequelize = {
  createLog: async (user_id, endpoint, method, status, message) => {
    const safeEndpoint = endpoint || "/";
    const safeMethod = method || "UNKNOWN";
    const safeStatus = status != null ? parseInt(status) : 0;
    const safeMessage = message || "";

    const log = await Log.create({
      user_id,
      endpoint: safeEndpoint,
      method: safeMethod,
      status: safeStatus,
      message: safeMessage,
    });

    return log.toJSON();
  },

  getAllLogs: async (filters = {}) => {
    const where = {};
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
      include: [
        {
          model: User,
          as: "User",
          attributes: ["name", "email"],
          required: false,
        },
      ],
      order: [["timestamp", "DESC"]],
      limit: 500,
      raw: true,
      nest: true,
    });

    return logs.map((log) => ({
      ...log,
      user_name: log.User?.name || "Usuario anónimo",
      user_email: log.User?.email || null,
    }));
  },

  getLogById: async (id) => {
    const log = await Log.findByPk(id, {
      include: [
        {
          model: User,
          as: "User",
          attributes: ["name", "email"],
          required: false,
        },
      ],
      raw: true,
      nest: true,
    });

    if (!log) return null;

    // Mapear los datos para mantener la estructura original
    return {
      ...log,
      user_name: log.User?.name || "Usuario anónimo",
      user_email: log.User?.email || null,
    };
  },

  //TODO: Implementar autoborrado / borrado de logs antiguos
  deleteOldLogs: async (daysToKeep = 30) => {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - daysToKeep);

    const result = await Log.destroy({
      where: {
        timestamp: {
          [Op.lt]: dateThreshold,
        },
      },
    });

    return { changes: result };
  },
};

module.exports = logModelSequelize;
