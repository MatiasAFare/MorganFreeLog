// Log routes
const express = require("express");
const router = express.Router();
const logController = require("../controllers/log.controller");
const { checkPermiso } = require("../middleware/checkPermiso.middleware");


// ========== RUTAS API (JSON) ==========
router.get("/export", checkPermiso("GESTIONAR LOGS"), logController.exportLogsToTxt); // Exportar logs a txt

// ========== RUTAS DE VISTA (HTML) ==========
router.get("/", checkPermiso("GESTIONAR LOGS"), logController.showLogsList);// Lista de logs


module.exports = router;
