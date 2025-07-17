// Default data seeder
const User = require("../models/sequelize/user.model");
const Rol = require("../models/sequelize/rol.model");
const Permiso = require("../models/sequelize/permiso.model");
const Item = require("../models/sequelize/item.model");
const Cart = require("../models/sequelize/cart.model");
const Quote = require("../models/sequelize/quote.model");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

const seedDefaultData = async () => {
  try {
    const userCount = await User.count();
    if (userCount > 0) {
      console.log("✓ Base de datos ya tiene datos iniciales");
      return;
    }

    console.log("🌱 Creando datos iniciales...");

    const adminRole = await Rol.create({ nombre: "Administrador" });
    const userRole = await Rol.create({ nombre: "Usuario" });

    const permisos = [
      { nombre: "ADMIN", descripcion: "Permisos varios" },
      { nombre: "SUPER ADMIN", descripcion: "Acceso total a la aplicación" },
      { nombre: "LOGIN", descripcion: "Poder acceder al login" },
      {
        nombre: "GESTIONAR USUARIOS",
        descripcion: "Puede crear, editar, eliminar usuarios",
      },
      {
        nombre: "GESTIONAR ROLES",
        descripcion: "Puede crear, editar, eliminar roles",
      },
      {
        nombre: "GESTIONAR PERMISOS",
        descripcion: "Puede crear, editar y eliminar permisos",
      },
      { nombre: "GESTIONAR ITEMS", descripcion: "Crear productos" },
      {
        nombre: "GESTIONAR LOGS",
        descripcion: "Puede ver los logs del sistema",
      },
    ];

    const createdPermisos = await Permiso.bulkCreate(permisos);

    await adminRole.setPermisos(createdPermisos);

    const loginPermiso = createdPermisos.find((p) => p.nombre === "LOGIN");
    if (loginPermiso) {
      await userRole.setPermisos([loginPermiso]);
    }

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

    const items = [
      { name: "Item 1", price: 10.0, stock: 100, category: "Category A" },
      { name: "Item 2", price: 20.0, stock: 50, category: "Category B" },
      { name: "Item 3", price: 15.0, stock: 75, category: "Category A" },
      { name: "Item 4", price: 30.0, stock: 20, category: "Category C" },
    ];

    await Item.bulkCreate(items);

    const cartItems = [
      { user_id: adminUser.id, item_id: 1, quantity: 2 },
      { user_id: regularUser.id, item_id: 2, quantity: 3 },
    ];

    await Cart.bulkCreate(cartItems);

    // Seeding frases de Morgan Freeman
    const quotesCount = await Quote.count();
    if (quotesCount === 0) {
      console.log("🎬 Agregando frases de Morgan Freeman...");

      try {
        const quotesPath = path.join(
          __dirname,
          "..",
          "utils",
          "morgan.quotes.json"
        );
        const quotesData = JSON.parse(fs.readFileSync(quotesPath, "utf8"));

        const quotesToInsert = quotesData.morganFreemanQuotes.map(
          (quoteText) => ({
            text: quoteText,
            author: quotesData.metadata.actor,
            source: quotesData.metadata.source,
            active: true,
          })
        );

        await Quote.bulkCreate(quotesToInsert);
        console.log(
          `✓ ${quotesToInsert.length} frases de Morgan Freeman agregadas`
        );
      } catch (error) {
        console.error("❌ Error al cargar frases:", error.message);
        // Agregar al menos una frase por defecto
        await Quote.create({
          text: "La mejor manera de garantizar una pérdida es renunciar.",
          author: "Morgan Freeman",
          source: "Manual",
          active: true,
        });
      }
    }

    console.log("✓ Datos iniciales creados exitosamente");
  } catch (error) {
    console.error("❌ Error al crear datos iniciales:", error.message);
  }
};

module.exports = { seedDefaultData };
