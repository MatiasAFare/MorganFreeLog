const logService = require("../services/log.service");

const logController = {
  // ========== VIEW METHODS ==========
  showLogsList: async (req, res) => {
    try {
      const filters = req.query;
      const logs = await logService.getAllLogs(filters);
      
      res.render("logs/index", {
        title: "Logs del Sistema",
        logs: logs,
        filters: filters,
        error: req.query.error,
        success: req.query.success
      });
    } catch (error) {
      console.error("Error al obtener logs:", error);
      res.render("error", {
        message: "Error al cargar los logs",
        error: error.message,
      });
    }
  },

  showLogDetails: async (req, res) => {
    try {
      const log = await logService.getLogById(req.params.id);
      if (!log) {
        return res.status(404).render("error", {
          message: "Log no encontrado",
        });
      }
      
      res.render("logs/details", {
        title: "Detalles del Log",
        log: log
      });
    } catch (error) {
      res.render("error", {
        message: "Error al cargar detalles del log",
        error: error.message,
      });
    }
  },

  // ========== API METHODS ==========
  cleanOldLogs: async (req, res) => {
    try {
      const daysToKeep = req.body.days || 30;
      const result = await logService.cleanOldLogs(daysToKeep);
      
      res.redirect(`/logs?success=Se eliminaron ${result.changes} logs antiguos`);
    } catch (error) {
      res.redirect(`/logs?error=Error al limpiar logs: ${error.message}`);
    }
  }
};

module.exports = logController;
