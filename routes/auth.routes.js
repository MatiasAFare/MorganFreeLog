// Authentication routes
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");


// ========== RUTAS DE VISTA (HTML) ==========
router.get("/login", authController.showLoginForm); // Formulario de login
router.get("/register", authController.showRegisterForm); // Formulario de registro

// ========== RUTAS DE ACCIÓN (POST) ==========
router.post("/login", authController.handleLogin); // Procesar login
router.post("/register", authController.handleRegister); // Procesar registro
router.post("/logout", authController.handleLogout); // Procesar logout

module.exports = router;
