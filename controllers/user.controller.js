const UserService = require("../services/user.service");
const RolService = require("../services/rol.service");
const PermisoService = require("../services/permiso.service");

const userController = {
  // ========== API METHODS (JSON) ==========
  getUsers: async (req, res) => {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching users", error: error.message });
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await UserService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching user", error: error.message });
    }
  },

  createUser: async (req, res) => {
    try {
      const { name, email, rol_id } = req.body;
      if (!name || !email) {
        return res.status(400).json({ message: "Name and email are required" });
      }

      const result = await UserService.createUser(name, email, rol_id);
      res.status(201).json({
        message: "User created successfully",
        userId: result.lastInsertRowid,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating user", error: error.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, rol_id } = req.body;

      if (!name || !email) {
        return res.status(400).json({ message: "Name and email are required" });
      }

      const result = await UserService.updateUser(id, name, email, rol_id);
      if (result.changes === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating user", error: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await UserService.deleteUser(id);

      if (result.changes === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting user", error: error.message });
    }
  },

  // ========== SHOW METHODS (Views) ==========
  showUsersList: async (req, res) => {
    try {
      const users = await UserService.getAllUsers();

      // Obtener información de rol para cada usuario
      const usersWithRoles = await Promise.all(
        users.map(async (user) => {
          if (user.rol_id) {
            const rol = await RolService.getById(user.rol_id);
            return {
              ...user,
              rol_nombre: rol ? rol.nombre : "Rol desconocido",
            };
          }
          return { ...user, rol_nombre: "Sin rol asignado" };
        })
      );

      res.render("usuarios/index", {
        users: usersWithRoles,
        error: req.query.error,
      });
    } catch (error) {
      res.render("error", {
        message: "Error al cargar usuarios",
        error: error.message,
      });
    }
  },

  showCreateForm: async (req, res) => {
    try {
      const roles = await RolService.getAll();
      res.render("usuarios/new", { roles, error: null });
    } catch (error) {
      res.render("error", {
        message: "Error al cargar formulario",
        error: error.message,
      });
    }
  },

  showDetails: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await UserService.getUserWithRole(id);

      if (!user) {
        return res.render("error", { message: "Usuario no encontrado" });
      }

      const permisos = user.rol_id
        ? await PermisoService.getByRolId(user.rol_id)
        : [];

      res.render("users/details", {
        user,
        permisos,
      });
    } catch (error) {
      res.render("error", {
        message: "Error al cargar detalles del usuario",
        error: error.message,
      });
    }
  },

  showEditForm: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);

      if (!user) {
        return res.render("error", { message: "Usuario no encontrado" });
      }

      const roles = await RolService.getAll();

      res.render("users/edit", {
        user,
        roles,
        error: null,
      });
    } catch (error) {
      res.render("error", {
        message: "Error al cargar formulario de edición",
        error: error.message,
      });
    }
  },
  showDetails: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await UserService.getUserWithRole(id);

      if (!user) {
        return res.render("error", { message: "Usuario no encontrado" });
      }

      const permisos = user.rol_id
        ? await PermisoService.getByRolId(user.rol_id)
        : [];

      // Fix the path if your template is in a different location
      res.render("usuarios/details", {  // Changed from "users/details" to "usuarios/details"
        user,
        permisos,
      });
    } catch (error) {
      res.render("error", {
        message: "Error al cargar detalles del usuario",
        error: error.message,
      });
    }
  },

  // ========== HANDLE METHODS (Actions) ==========
  handleCreate: async (req, res) => {
    try {
      const { name, email, password, rol_id } = req.body;

      if (!name || !email || !password) {
        const roles = await RolService.getAll();
        return res.render("usuarios/new", {
          error: "El nombre, contraseña y el email son requeridos",
          roles,
          user: { name, email, password, rol_id },
        });
      }

      await UserService.createUser(name, email, password, rol_id);
      res.redirect("/usuarios");
    } catch (error) {
      const roles = await RolService.getAll();
      res.render("usuarios/new", {
        error: error.message,
        roles,
        user: req.body,
      });
    }
  },

  handleUpdate: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, rol_id } = req.body;

      if (!name || !email) {
        const roles = await RolService.getAll();
        const user = await UserService.getUserById(id);

        return res.render("users/edit", {
          error: "El nombre y el email son requeridos",
          user: { ...user, name, email, rol_id },
          roles,
        });
      }

      await UserService.updateUser(id, name, email, rol_id || null);
      res.redirect("/usuarios");
    } catch (error) {
      const roles = await RolService.getAll();
      const user = { id: req.params.id, ...req.body };

      res.render("users/edit", {
        error: error.message,
        user,
        roles,
      });
    }
  },

  handleDelete: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await UserService.deleteUser(id);

      if (result.changes === 0) {
        return res.redirect("/usuarios?error=Usuario no encontrado");
      }

      res.redirect("/usuarios");
    } catch (error) {
      res.redirect(`/usuarios?error=${encodeURIComponent(error.message)}`);
    }
  },
};

module.exports = userController;
