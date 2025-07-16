const UserModel = require("../models/user.model.sequelize");
const passwordUtil = require("../utils/password.util");

const UserService = {
  getAllUsers: async () => {
    return await UserModel.getAllUsers();
  },

  getUserById: async (id) => {
    return await UserModel.getUserById(id);
  },

  getUserWithRole: async (id) => {
    return await UserModel.getUserWithRole(id);
  },

  createUser: async (name, email, password, rol_id) => {
    // Hashear la contraseña antes de almacenarla
    const hashedPassword = await passwordUtil.hashPassword(password);
    return await UserModel.createUser(name, email, hashedPassword, rol_id);
  },

  updateUser: async (id, name, email, rol_id) => {
    return await UserModel.updateUser(id, name, email, rol_id);
  },

  deleteUser: async (id) => {
    return await UserModel.deleteUser(id);
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
