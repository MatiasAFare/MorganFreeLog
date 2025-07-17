// Quote model adapter
const Quote = require("./sequelize/quote.model");

const quoteModelSequelize = {
  getRandomQuote: async () => {
    const quote = await Quote.findOne({
      where: { active: true },
      order: Quote.sequelize.random(),
    });
    return quote ? quote.toJSON() : null;
  },

  getAllQuotes: async () => {
    const quotes = await Quote.findAll({
      where: { active: true },
      order: [["id", "ASC"]],
    });
    return quotes.map((quote) => quote.toJSON());
  },

  getQuoteById: async (id) => {
    const quote = await Quote.findByPk(id);
    return quote ? quote.toJSON() : null;
  },

  getQuoteByIndex: async (index) => {
    const quote = await Quote.findOne({
      where: { active: true },
      order: [["id", "ASC"]],
      offset: index - 1,
      limit: 1,
    });
    return quote ? quote.toJSON() : null;
  },

  bulkCreateQuotes: async (quotesArray) => {
    const quotes = await Quote.bulkCreate(quotesArray);
    return quotes.map((quote) => quote.toJSON());
  },
};

module.exports = quoteModelSequelize;
