const express = require("express");
const router = express.Router();
const logController = require("../controllers/log.controller");
const { checkPermiso } = require("../middleware/checkPermiso.middleware");

// ========== VIEW ROUTES ==========
router.get("/", checkPermiso("GESTIONAR LOGS"), logController.showLogsList);

module.exports = router;
