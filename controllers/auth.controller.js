const UserService = require("../services/user.service");
const RoleService = require("../services/rol.service"); // Assuming roleService is defined and imported
const authController = {
  showLoginForm: (req, res) => {
    if (req.session.userId) {
      return res.redirect("/home");
    }
    res.render("auth/login", { title: "Login", error: null });
  },
  handleLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.render("auth/login", {
          title: "Login",
          error: "Email y contraseña son requeridos"
        });
      }

      const user = await UserService.loginUser(email, password);
      if (!user) {
        return res.render("auth/login", {
          title: "Login",
          error: "Credenciales inválidas"
        });
      }

      req.session.userId = user.id;
      req.session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        rol_id: user.rol_id
      };
      req.session.isLoggedIn = true;

      req.session.save((err) => {
        if (err) console.error("Session save error:", err);
        return res.redirect("/");
      });
    } catch (error) {
      return res.render("auth/login", {
        title: "Login",
        error: "Error al iniciar sesión: " + error.message
      });
    }
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
      return res.redirect('/auth/login');
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).render('error', {
          message: 'Error al cerrar sesión',
          error: err
        });
      }
      return res.redirect('/auth/login');
    });
  },
};

module.exports = authController;
