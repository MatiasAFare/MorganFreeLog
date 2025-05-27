const UserModel = require("../models/user.model");

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
    return UserModel.createUser(name, email, password, rol_id);
  },

  updateUser: async (id, name, email, rol_id = null) => {
    return UserModel.updateUser(id, name, email, rol_id);
  },

  deleteUser: async (id) => {
    return UserModel.deleteUser(id);
  },
  loginUser: async (email, password) => {
    const user = await UserModel.getUserByEmail(email);
    if (!user || user.password !== password) {
      throw new Error("Invalid credentials");
    }
    return user;
  },
};

module.exports = UserService;
