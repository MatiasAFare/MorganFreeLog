// Quote service
const QuoteModel = require("../models/quote.model.sequelize");

const QuoteService = {
  getRandomQuote: async () => {
    try {
      const quote = await QuoteModel.getRandomQuote();

      if (!quote) {
        throw new Error("No se encontraron frases en la base de datos");
      }

      return {
        quote: quote.text,
        author: quote.author,
        id: quote.id,
        source: quote.source,
      };
    } catch (error) {
      throw new Error(`Error al obtener frase aleatoria: ${error.message}`);
    }
  },

  getAllQuotes: async () => {
    try {
      const quotes = await QuoteModel.getAllQuotes();

      return {
        quotes: quotes.map((quote) => ({
          id: quote.id,
          text: quote.text,
          author: quote.author,
          source: quote.source,
          active: quote.active,
        })),
        metadata: {
          author: quotes.length > 0 ? quotes[0].author : "Morgan Freeman",
          source: quotes.length > 0 ? quotes[0].source : null,
        },
      };
    } catch (error) {
      throw new Error(`Error al obtener todas las frases: ${error.message}`);
    }
  },

  getQuoteById: async (id) => {
    try {
      const quote = await QuoteModel.getQuoteById(id);

      if (!quote) {
        throw new Error(`No se encontró la frase con ID ${id}`);
      }

      return {
        quote: quote.text,
        author: quote.author,
        id: quote.id,
        source: quote.source,
        active: quote.active,
      };
    } catch (error) {
      throw new Error(`Error al obtener frase por ID: ${error.message}`);
    }
  },
};

module.exports = QuoteService;
