const User = require('./sequelize/user.model');
const sequelize = require('../config/sequelize');
const bcrypt = require('bcrypt');

// Función para inicializar usuarios por defecto
const insertDefaultUsers = async () => {
  const users = [
    {
      name: "Administrador",
      email: "admin@admin.com",
      password: "admin123",
      rol_id: 1
    },
    {
      name: "Usuario",
      email: "user@user.com", 
      password: "user123",
      rol_id: 2
    }
  ];
  
  for (const userData of users) {
    try {
      const existingUser = await User.findOne({ where: { email: userData.email } });
      if (!existingUser) {
        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        await User.create({
          ...userData,
          password: hashedPassword
        });
      }
    } catch (error) {
      console.error(`Error al crear usuario ${userData.email}:`, error.message);
    }
  }
};

const initUsers = async () => {
  try {
    const count = await User.count();
    if (count === 0) {
      console.log("Semillando la base de datos con usuarios por defecto...");
      await insertDefaultUsers();
    }
  } catch (error) {
    console.error("Error al inicializar usuarios:", error.message);
  }
};

const userModelSequelize = {
  getUserById: async (id) => {
    const user = await User.findByPk(id);
    return user ? user.toJSON() : null;
  },

  getAllUsers: async () => {
    const users = await User.findAll();
    return users.map(user => user.toJSON());
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
    const user = await sequelize.query(
      `SELECT u.*, r.nombre as rol_nombre 
       FROM users u
       LEFT JOIN roles r ON u.rol_id = r.id
       WHERE u.id = ?`,
      {
        replacements: [id],
        type: sequelize.QueryTypes.SELECT
      }
    );
    
    return user.length > 0 ? user[0] : null;
  },

  getUserByEmail: async (email) => {
    const user = await User.findOne({ where: { email } });
    return user ? user.toJSON() : null;
  }
};

// Inicializar usuarios por defecto
initUsers();

module.exports = userModelSequelize;
