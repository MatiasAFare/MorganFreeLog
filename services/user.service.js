const UserModel = require("../models/user.model");
const passwordUtil = require("../utils/password.util");

const UserService = {
  getAllUsers: async () => {
    return UserModel.getAllUsers();
  },

  getUserById: async (id) => {
    return UserModel.getUserById(id);
  },

  getUserWithRole: async (id) => {
    return UserModel.getUserWithRole(id);
  },

  createUser: async (name, email, password, rol_id) => {
    // Hashear la contraseña antes de almacenarla
    const hashedPassword = await passwordUtil.hashPassword(password);
    return UserModel.createUser(name, email, hashedPassword, rol_id);
  },

  updateUser: async (id, name, email, rol_id) => {
    return UserModel.updateUser(id, name, email, rol_id);
  },

  deleteUser: async (id) => {
    return UserModel.deleteUser(id);
  },

  loginUser: async (email, password) => {
    try {
      const user = await UserModel.getUserByEmail(email);
      if (!user) {
        throw new Error("Invalid credentials");
      }

      // Verificar contraseña hasheada
      const isPasswordValid = await passwordUtil.verifyPassword(password, user.password);
      
      if (!isPasswordValid) {
        throw new Error("Invalid credentials");
      }

      // Retornar usuario sin la contraseña por seguridad
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw new Error("Invalid credentials");
    }
  },
};

module.exports = UserService;
