// Authentication controller
const UserService = require("../services/user.service");
const RoleService = require("../services/rol.service");

const authController = {
  // ========== MÉTODOS DE VISTA (Vistas) ==========
  showLoginForm: (req, res) => {
    if (req.session.userId) {
      return res.redirect("/home");
    }
    res.render("auth/login", { title: "Login", error: null });
  },

  showRegisterForm: async (req, res) => {
    if (req.session.userId) {
      return res.redirect("/home");
    }
    const rolesList = await RoleService.getAll();
    let errors = null;
    if (!rolesList || rolesList.length === 0) {
      errors = "No roles available. Please contact the administrator.";
    }
    res.render("auth/register", {
      title: "Register",
      error: errors,
      roles: rolesList,
    });
  },

  // ========== MÉTODOS DE MANEJO (Acciones) ==========
  // Responsable de crear la cookie de sesion (por defecto connect.sid)
  handleLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.render("auth/login", {
          title: "Login",
          error: "Email y contraseña son requeridos",
        });
      }

      console.log("[Auth] Intentando login para:", email);

      const user = await UserService.loginUser(email, password);
      if (!user) {
        console.log("[Auth] Login fallido - credenciales inválidas");
        return res.render("auth/login", {
          title: "Login",
          error: "Credenciales inválidas",
        });
      }

      console.log("[Auth] Usuario autenticado exitosamente:", user.name);

      req.session.regenerate((err) => {
        if (err) {
          console.error("Error regenerando sesión:", err);
          return res.render("auth/login", {
            title: "Login",
            error: "Error al iniciar sesión",
          });
        }
        //Creacion de cookie de sesión
        req.session.userId = user.id;
        req.session.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          rol_id: user.rol_id,
        };
        req.session.isLoggedIn = true;

        console.log("[Auth] Sesión creada:", {
          sessionUserId: req.session.userId,
          sessionUser: req.session.user,
          isLoggedIn: req.session.isLoggedIn,
        });

        req.session.save((err) => {
          if (err) {
            console.error("Error guardando sesión:", err);
            return res.render("auth/login", {
              title: "Login",
              error: "Error al iniciar sesión",
            });
          }
          console.log("[Auth] Sesión guardada exitosamente");
          return res.redirect("/");
        });
      });
    } catch (error) {
      return res.render("auth/login", {
        title: "Login",
        error: "Error al iniciar sesión: " + error.message,
      });
    }
  },

  handleRegister: async (req, res) => {
    try {
      const { username, email, password, rol } = req.body;
      if (!username || !password || !email) {
        return res
          .status(400)
          .json({ message: "Username, email and password are required" });
      }

      const result = await UserService.createUser(
        username,
        email,
        password,
        rol
      );
      res.status(201).json({
        message: "User registered successfully",
        userId: result.lastInsertRowid,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error registering user", error: error.message });
    }
  },

  handleLogout: (req, res) => {
    if (!req.session.userId) {
      return res.redirect("/auth/login");
    }

    console.log("[Auth] Cerrando sesión para usuario:", req.session.user?.name);

    req.session.userId = null;
    req.session.user = null;
    req.session.isLoggedIn = false;

    req.session.destroy((err) => {
      if (err) {
        console.error("Error al destruir sesión:", err);
        return res.status(500).render("error", {
          message: "Error al cerrar sesión",
          error: err,
        });
      }

      res.clearCookie("connect.sid");
      console.log("[Auth] Sesión cerrada exitosamente");

      return res.redirect("/auth/login");
    });
  },
};

module.exports = authController;
