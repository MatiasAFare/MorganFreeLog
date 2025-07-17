// User model adapter
const User = require("./sequelize/user.model");
const Rol = require("./sequelize/rol.model");
const userModelSequelize = {
    
  getUserById: async (id) => {
    const user = await User.findByPk(id);
    return user ? user.toJSON() : null;
  },

  getAllUsers: async () => {
    const users = await User.findAll();
    return users.map((user) => user.toJSON());
  },

  createUser: async (name, email, password, rol_id) => {
    const user = await User.create({ name, email, password, rol_id });
    return user.toJSON();
  },

  updateUser: async (id, name, email, rol_id) => {
    const [updatedRows] = await User.update(
      { name, email, rol_id },
      { where: { id } }
    );

    if (updatedRows === 0) {
      return null;
    }

    return await userModelSequelize.getUserById(id);
  },

  deleteUser: async (id) => {
    const result = await User.destroy({ where: { id } });
    return { changes: result };
  },

  getUserWithRole: async (id) => {
    try {
      const user = await User.findByPk(id, {
        include: [{
          model: Rol,
          as: 'rol'
        }]
      });
      
      if (!user) return null;
      
      const userData = user.toJSON();
      return {
        ...userData,
        rol_nombre: userData.rol ? userData.rol.nombre : null
      };
    } catch (error) {
      console.error("Error al obtener usuario con rol:", error.message);
      return null;
    }
  },

  getUserByEmail: async (email) => {
    const user = await User.findOne({ where: { email } });
    return user ? user.toJSON() : null;
  },
};

module.exports = userModelSequelize;
