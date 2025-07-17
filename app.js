// Main application server
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const session = require("express-session");
const { initializeDatabase } = require("./config/database.init");
const { setupMorganMiddleware } = require("./config/morgan.config");

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

setupMorganMiddleware(app);

app.use("/usuarios", require("./routes/user.routes"));
app.use("/roles", require("./routes/roles.routes"));
app.use("/permisos", require("./routes/permiso.routes"));
app.use("/auth", require("./routes/auth.routes"));
app.use("/shop", require("./routes/shop.routes"));
app.use("/cart", require("./routes/cart.routes"));
app.use("/logs", require("./routes/log.routes"));
app.use("/api/quotes", require("./routes/quote.routes"));

app.get("/", require("./controllers/quote.controller").showIndexWithQuote);

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
