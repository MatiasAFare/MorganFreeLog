const express = require("express");
const router = express.Router();
const logController = require("../controllers/log.controller");
const { checkPermiso } = require("../middleware/checkPermiso.middleware");

// ========== RUTAS DE VISTA ==========
router.get("/", checkPermiso("GESTIONAR LOGS"), logController.showLogsList);

// ========== EXPORT ROUTES ==========
router.get("/export", checkPermiso("GESTIONAR LOGS"), logController.exportLogsToTxt);

module.exports = router;
