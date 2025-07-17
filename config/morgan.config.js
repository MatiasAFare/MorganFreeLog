// Morgan logging configuration
const morgan = require("morgan");
const logService = require("../services/log.service");

const logStream = {
  write: async (message) => {
    try {
      const cleanMessage = message.trim();

      const parts = cleanMessage.split("|");
      if (parts.length >= 4) {
        const method = parts[0];
        const url = parts[1];
        const status = parseInt(parts[2]) || 0;
        const userIdStr = parts[3];
        const userId =
          userIdStr === "null" ? null : parseInt(userIdStr) || null;
        const fullMessage = parts[4] || cleanMessage;
        console.log(`[Log Write] Full Message: ${fullMessage}`);
        await logService.createLog(userId, url, method, status, fullMessage);
      }
    } catch (error) {
      console.error("Error al procesar log de Morgan:", error);
    }
  },
};

const setupMorganMiddleware = (app) => {
  app.use((req, res, next) => {
    const userId =
      req.user?.id || req.session?.user?.id || req.session?.userId || null;
    global.currentUserId = userId;
    req.currentUserId = userId;
    next();
  });

  morgan.token("userIdForLog", (req) => {
    const userId =
      req.user?.id ||
      req.session?.user?.id ||
      req.session?.userId ||
      req.currentUserId ||
      null;
    global.currentUserId = userId;
    return userId !== null ? userId : "null";
  });

  const customFormat =
    ":method|:url|:status|:userIdForLog|:remote-addr :method :url :status :res[content-length] - :response-time ms";

  app.use(morgan(customFormat, { stream: logStream }));
};

module.exports = { setupMorganMiddleware };
