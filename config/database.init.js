const sequelize = require("../config/sequelize");
const { setupAssociations } = require("../models/sequelize/associations");
const { seedDefaultData } = require("../seeders/defaultData.seeder");

const initializeDatabase = async () => {
  try {
    console.log("🔄 Inicializando base de datos...");
    
    // Configurar asociaciones entre modelos
    setupAssociations();
    console.log("✓ Asociaciones de modelos configuradas");
    
    // Sincronizar modelos con la base de datos
    await sequelize.sync({ alter: false });
    console.log("✓ Modelos sincronizados con la base de datos");
    
    // Ejecutar seeders
    await seedDefaultData();
    
    console.log("🎉 Base de datos inicializada correctamente");
    
  } catch (error) {
    console.error("❌ Error al inicializar base de datos:", error.message);
    throw error;
  }
};

module.exports = { initializeDatabase };
