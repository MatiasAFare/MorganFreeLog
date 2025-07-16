const User = require("../models/sequelize/user.model");
const Rol = require("../models/sequelize/rol.model");
const Permiso = require("../models/sequelize/permiso.model");
const Item = require("../models/sequelize/item.model");
const Cart = require("../models/sequelize/cart.model");
const bcrypt = require("bcrypt");

const seedDefaultData = async () => {
  try {
    // Verificar si ya hay datos
    const userCount = await User.count();
    if (userCount > 0) {
      console.log("✓ Base de datos ya tiene datos iniciales");
      return;
    }

    console.log("🌱 Creando datos iniciales...");

    // Crear roles por defecto
    const adminRole = await Rol.create({ nombre: "Administrador" });
    const userRole = await Rol.create({ nombre: "Usuario" });

    // Crear permisos por defecto (usando los permisos que ya tenías)
    const permisos = [
      { nombre: "ADMIN", descripcion: "Permisos varios" },
      { nombre: "SUPER ADMIN", descripcion: "Acceso total a la aplicación" },
      { nombre: "LOGIN", descripcion: "Poder acceder al login" },
      { nombre: "GESTIONAR USUARIOS", descripcion: "Puede crear, editar, eliminar usuarios" },
      { nombre: "GESTIONAR ROLES", descripcion: "Puede crear, editar, eliminar roles" },
      { nombre: "GESTIONAR PERMISOS", descripcion: "Puede crear, editar y eliminar permisos" },
      { nombre: "GESTIONAR ITEMS", descripcion: "Crear productos" },
      { nombre: "GESTIONAR LOGS", descripcion: "Puede ver los logs del sistema" },
    ];

    const createdPermisos = await Permiso.bulkCreate(permisos);

    // Asignar todos los permisos al rol administrador usando asociaciones
    await adminRole.setPermisos(createdPermisos);

    // Asignar solo LOGIN al rol usuario
    const loginPermiso = createdPermisos.find(p => p.nombre === 'LOGIN');
    if (loginPermiso) {
      await userRole.setPermisos([loginPermiso]);
    }

    // Crear usuarios por defecto
    const adminPassword = await bcrypt.hash("admin123", 10);
    const userPassword = await bcrypt.hash("user123", 10);

    const adminUser = await User.create({
      name: "Administrador",
      email: "admin@admin.com",
      password: adminPassword,
      rol_id: adminRole.id,
    });

    const regularUser = await User.create({
      name: "Usuario",
      email: "user@user.com",
      password: userPassword,
      rol_id: userRole.id,
    });

    // Crear items por defecto
    const items = [
      { name: "Item 1", price: 10.0, stock: 100, category: "Category A" },
      { name: "Item 2", price: 20.0, stock: 50, category: "Category B" },
      { name: "Item 3", price: 15.0, stock: 75, category: "Category A" },
      { name: "Item 4", price: 30.0, stock: 20, category: "Category C" },
    ];

    await Item.bulkCreate(items);

    // Crear algunos items en el carrito como ejemplo
    const cartItems = [
      { user_id: adminUser.id, item_id: 1, quantity: 2 },
      { user_id: regularUser.id, item_id: 2, quantity: 3 },
    ];

    await Cart.bulkCreate(cartItems);

    console.log("✓ Datos iniciales creados exitosamente");
    
  } catch (error) {
    console.error("❌ Error al crear datos iniciales:", error.message);
  }
};

module.exports = { seedDefaultData };
