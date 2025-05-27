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
        return res
          .status(403)
          .json({ message: "Email and password are required" });
      }

      const user = await UserService.loginUser(email, password);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;
      res.status(200).json({ message: "Login successful", userId: user.id });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error logging in", error: error.message });
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
      return res.status(401).json({ message: "User not logged in" });
    }

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      }
      res.status(200).json({ message: "Logout successful" });
    });
  },
};

module.exports = authController;
