// Quote controller
const QuoteService = require("../services/quote.service");

const quoteController = {
  // ========== MÉTODOS DE VISTA (HTML) ==========
  showIndexWithQuote: async (req, res) => {
    try {
      const quoteData = await QuoteService.getRandomQuote();

      res.render("index", {
        randomQuote: quoteData,
      });
    } catch (error) {
      console.error("Error al obtener frase para vista:", error);
      // Renderizar con frase por defecto en caso de error
      res.render("index", {
        randomQuote: {
          quote: "La mejor manera de garantizar una pérdida es renunciar.",
          author: "Morgan Freeman",
          id: null,
          total: 0,
          source: "Default",
        },
      });
    }
  },

  // Helper para obtener frase aleatoria y usarla en otras vistas
  getRandomQuoteForView: async () => {
    try {
      return await QuoteService.getRandomQuote();
    } catch (error) {
      console.error("Error al obtener frase para vista:", error);
      return {
        quote: "La mejor manera de garantizar una pérdida es renunciar.",
        author: "Morgan Freeman",
        id: null,
        total: 0,
        source: "Default",
      };
    }
  },

  /*
   * Ejemplo de uso en otros controladores:
   *
   * const quoteController = require("../controllers/quote.controller");
   *
   * someOtherController: async (req, res) => {
   *   const randomQuote = await quoteController.getRandomQuoteForView();
   *   res.render("some-view", { randomQuote });
   * }
   */

  // ========== MÉTODOS API (JSON) ==========
  getRandomQuote: async (req, res) => {
    try {
      const quoteData = await QuoteService.getRandomQuote();
      res.status(200).json(quoteData);
    } catch (error) {
      console.error("Error al obtener frase aleatoria:", error);
      res.status(500).json({
        error: "Error interno del servidor",
        quote: "La mejor manera de garantizar una pérdida es renunciar.",
        author: "Morgan Freeman",
      });
    }
  },

  getAllQuotes: async (req, res) => {
    try {
      const quotesData = await QuoteService.getAllQuotes();
      res.status(200).json(quotesData);
    } catch (error) {
      console.error("Error al obtener todas las frases:", error);
      res.status(500).json({
        message: "Error al obtener las frases",
        error: error.message,
      });
    }
  },

  getQuoteById: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          error: "El ID debe ser un número válido",
        });
      }

      const quoteData = await QuoteService.getQuoteById(id);
      res.status(200).json(quoteData);
    } catch (error) {
      console.error("Error al obtener frase por ID:", error);
      res.status(500).json({
        message: "Error al obtener la frase",
        error: error.message,
      });
    }
  },
};

module.exports = quoteController;
