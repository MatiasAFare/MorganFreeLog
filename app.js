// Main application server
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const session = require("express-session");
const morgan = require("morgan");
const logService = require("./services/log.service");
const { initializeDatabase } = require("./config/database.init");

const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "clave-secreta-predeterminada",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.isLoggedIn ? req.session.user : null;
  res.locals.isLoggedIn = !!req.session.isLoggedIn;
  next();
});

// Authentication middleware
app.use(async (req, res, next) => {
  try {
    if (!req.session.isLoggedIn) {
      req.user = null;
      return next();
    }
    
    const userId = req.session?.user?.id || req.session?.userId || null;
    
    if (userId) {
      const UserService = require("./services/user.service");
      const user = await UserService.getUserById(userId);
      
      if (user) {
        req.user = user;
        console.log(`[Universal Auth] Usuario detectado: ${user.name} (ID: ${user.id})`);
      } else {
        console.log(`[Universal Auth] Usuario no encontrado en BD para ID: ${userId}, limpiando sesión`);
        req.session.destroy();
        req.user = null;
      }
    } else {
      req.user = null;
    }
    
    next();
  } catch (error) {
    console.error("Error en middleware universal de auth:", error);
    req.user = null;
    next();
  }
});

// Morgan logging configuration
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
        const userId = userIdStr === "null" ? null : parseInt(userIdStr) || null;
        const fullMessage = parts[4] || cleanMessage;

        console.log(`[Log Write] URL: ${url}, Method: ${method}, User ID: ${userId}`);

        await logService.createLog(userId, url, method, status, fullMessage);
      }
    } catch (error) {
      console.error("Error al procesar log de Morgan:", error);
    }
  },
};

app.use((req, res, next) => {
  const userId = req.user?.id || req.session?.user?.id || req.session?.userId || null;
  global.currentUserId = userId;
  
  req.currentUserId = userId;
  
  next();
});

morgan.token("userId", (req) => {
  const userId = req.user?.id || req.session?.user?.id || req.session?.userId || req.currentUserId || null;
  return userId || "anonymous";
});

morgan.token("userIdForLog", (req) => {
  const userId = req.user?.id || req.session?.user?.id || req.session?.userId || req.currentUserId || null;
  global.currentUserId = userId;
  return userId !== null ? userId : "null";
});

const customFormat =
  ":method|:url|:status|:userIdForLog|:remote-addr :method :url :status :res[content-length] - :response-time ms";

app.use(morgan(customFormat, { stream: logStream }));
app.use(morgan("dev"));

app.use("/usuarios", require("./routes/user.routes"));
app.use("/roles", require("./routes/roles.routes"));
app.use("/permisos", require("./routes/permiso.routes"));
app.use("/auth", require("./routes/auth.routes"));
app.use("/shop", require("./routes/shop.routes"));
app.use("/cart", require("./routes/cart.routes"));
app.use("/logs", require("./routes/log.routes"));

app.get("/", (req, res) => {
  res.render("index");
});

app.use((req, res) => {
  res.status(404).render("error", {
    message: "Página no encontrada",
    error: "La página que busca no existe",
  });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar servidor:", error.message);
    process.exit(1);
  }
};

startServer();
