const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// ========== VIEW ROUTES (HTML) ==========
router.get("/login", authController.showLoginForm); // Mostrar formulario de inicio de sesión
router.get("/register", authController.showRegisterForm); // Mostrar formulario de registro

// ========== ACTION ROUTES (POST) ==========
router.post("/login", authController.handleLogin); // Procesar inicio de sesión
router.post("/register", authController.handleRegister); // Procesar registro
router.post("/logout", authController.handleLogout); // Procesar cierre de sesión

module.exports = router;
