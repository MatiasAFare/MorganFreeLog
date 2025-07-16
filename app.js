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
app.use(express.urlencoded({ extended: true })); // Para datos de formularios
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
  res.locals.user = req.session.user || null;
  res.locals.isLoggedIn = !!req.session.isLoggedIn;
  next();
});

// Middleware universal para detectar usuario autenticado (sin bloquear rutas públicas)
app.use(async (req, res, next) => {
  try {
    // Intentar obtener user_id de la sesión
    const userId = req.session?.user?.id || req.session?.userId || null;
    
    if (userId) {
      // Si tenemos userId, obtener datos completos del usuario
      const UserService = require("./services/user.service");
      const user = await UserService.getUserById(userId);
      
      if (user) {
        req.user = user;
        console.log(`[Universal Auth] Usuario detectado: ${user.name} (ID: ${user.id})`);
      } else {
        console.log(`[Universal Auth] Usuario no encontrado en BD para ID: ${userId}`);
      }
    }
    
    next();
  } catch (error) {
    console.error("Error en middleware universal de auth:", error);
    next(); // Continuar sin bloquear
  }
});

// ========== MORGAN LOGGING ==========
// Crear stream personalizado para escribir a BD
const logStream = {
  write: async (message) => {
    try {
      // Morgan envía el mensaje con \n al final, lo removemos
      const cleanMessage = message.trim();

      // Extraer información del mensaje usando el formato personalizado
      // Formato esperado: "METHOD|URL|STATUS|USERID|MESSAGE"
      const parts = cleanMessage.split("|");
      if (parts.length >= 4) {
        const method = parts[0];
        const url = parts[1];
        const status = parseInt(parts[2]) || 0;
        const userId = parts[3] === "null" ? null : parts[3];
        const fullMessage = parts[4] || cleanMessage;

        console.log(`[Log Write] URL: ${url}, Method: ${method}, User ID: ${userId}`);

        // Crear log en BD
        await logService.createLog(userId, url, method, status, fullMessage);
      }
    } catch (error) {
      console.error("Error al procesar log de Morgan:", error);
    }
  },
};

// Middleware para capturar user_id antes del logging
app.use((req, res, next) => {
  // Obtener user_id de múltiples fuentes posibles (ahora req.user debería estar disponible)
  const userId = req.user?.id || req.session?.user?.id || req.session?.userId || null;
  global.currentUserId = userId;
  
  // Agregar el user_id al objeto request para acceso posterior
  req.currentUserId = userId;
  
  next();
});

// Configurar Morgan con formato personalizado
morgan.token("userId", (req) => {
  // Intentar obtener user_id de múltiples fuentes
  const userId = req.user?.id || req.session?.user?.id || req.session?.userId || req.currentUserId || null;
  return userId || "anonymous";
});

// Crear token personalizado para user_id en el mensaje
morgan.token("userIdForLog", (req) => {
  const userId = req.user?.id || req.session?.user?.id || req.session?.userId || req.currentUserId || null;
  global.currentUserId = userId; // Actualizar el global también
  return userId || null;
});

// Formato personalizado: METHOD|URL|STATUS|USERID|FULL_MESSAGE
const customFormat =
  ":method|:url|:status|:userIdForLog|:remote-addr :method :url :status :res[content-length] - :response-time ms";

app.use(morgan(customFormat, { stream: logStream }));
app.use(morgan("dev")); // También mostrar en consola para desarrollo

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

// Inicializar base de datos y arrancar servidor
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
