const UserModel = require('../models/user.model');

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

    createUser: async (name, email, rol_id = null) => {
        return UserModel.createUser(name, email, rol_id);
    },

    updateUser: async (id, name, email, rol_id = null) => {
        return UserModel.updateUser(id, name, email, rol_id);
    },

    deleteUser: async (id) => {
        return UserModel.deleteUser(id);
    }
};

module.exports = UserService;