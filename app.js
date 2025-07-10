const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const session = require("express-session");
require("./database");

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

app.use("/usuarios", require("./routes/user.routes"));
app.use("/roles", require("./routes/roles.routes"));
app.use("/permisos", require("./routes/permiso.routes"));
app.use("/auth", require("./routes/auth.routes"));
app.use("/shop", require("./routes/shop.routes"));
app.use("/cart", require("./routes/cart.routes"));

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
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
