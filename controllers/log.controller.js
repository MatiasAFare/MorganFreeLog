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

  // ========== MÉTODOS API ==========
  exportLogsToTxt: async (req, res) => {
    try {
      const filters = req.query;
      const logs = await logService.getAllLogs(filters);

      // Generar contenido del archivo TXT
      let txtContent = "LOGS DEL SISTEMA\n";
      txtContent += "==================\n";
      txtContent += `Exportado el: ${new Date().toLocaleString('es-ES')}\n`;
      txtContent += `Total de logs: ${logs.length}\n\n`;

      logs.forEach((log, index) => {
        txtContent += `--- LOG ${index + 1} ---\n`;
        txtContent += `Timestamp: ${new Date(log.timestamp).toLocaleString('es-ES')}\n`;
        txtContent += `Usuario: ${log.user_name || 'Anónimo'} ${log.user_email ? `(${log.user_email})` : ''}\n`;
        txtContent += `Método: ${log.method}\n`;
        txtContent += `Endpoint: ${log.endpoint}\n`;
        txtContent += `Estado: ${log.status}\n`;
        txtContent += `Mensaje: ${log.message || 'N/A'}\n\n`;
      });

      // Configurar headers para descarga
      const fileName = `logs_${new Date().toISOString().split('T')[0]}.txt`;
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

      // Enviar el archivo
      res.send(txtContent);
    } catch (error) {
      console.error("Error al exportar logs:", error);
      res.redirect(`/logs?error=Error al exportar logs: ${error.message}`);
    }
  },

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
