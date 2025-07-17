// Quote routes
const express = require("express");
const router = express.Router();
const quoteController = require("../controllers/quote.controller");

// ========== RUTAS DE VISTA (HTML) ==========
router.get("/index", quoteController.showIndexWithQuote); // Renderizar index con frase aleatoria

// ========== RUTAS API (JSON) ==========
router.get("/random", quoteController.getRandomQuote); // Obtener una frase aleatoria
router.get("/all", quoteController.getAllQuotes); // Obtener todas las frases
router.get("/id/:id", quoteController.getQuoteById); // Obtener una frase por ID

module.exports = router;
