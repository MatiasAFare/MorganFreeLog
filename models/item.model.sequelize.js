const Item = require('./sequelize/item.model');
const { Op } = require('sequelize');

// Función para inicializar datos por defecto
const insertDefaultItems = async () => {
  const items = [
    { name: "Item 1", price: 10.0, stock: 100, category: "Category A" },
    { name: "Item 2", price: 20.0, stock: 50, category: "Category B" },
    { name: "Item 3", price: 15.0, stock: 75, category: "Category A" },
    { name: "Item 4", price: 30.0, stock: 20, category: "Category C" },
  ];
  
  // Usar el modelo wrapper para crear items si no existen
  for (const item of items) {
    try {
      // Verificar si ya existe un item con este nombre
      const existingItems = await itemModelSequelize.getAll({ name: item.name });
      if (existingItems.length === 0) {
        await itemModelSequelize.create(item.name, item.price, item.stock, item.category);
      }
    } catch (error) {
      console.error(`Error al crear item ${item.name}:`, error.message);
    }
  }
};

const initItems = async () => {
  try {
    const allItems = await itemModelSequelize.getAll({});
    
    if (allItems.length === 0) {
      console.log("Semillando la base de datos con items por defecto...");
      await insertDefaultItems();
    }
  } catch (error) {
    console.error("Error al inicializar items:", error);
  }
};

// Declarar el objeto antes de usarlo
const itemModelSequelize = {
  getById: async (id) => {
    const item = await Item.findByPk(id);
    if (!item) return null;
    
    const itemData = item.toJSON();
    // Asegurar que los tipos numéricos sean correctos (mantener compatibilidad)
    return {
      ...itemData,
      price: parseFloat(itemData.price),
      stock: parseInt(itemData.stock)
    };
  },

  getAll: async (filters) => {
    const where = {};
    const order = [];

    // Filtros (manteniendo la misma lógica)
    if (filters.stock) {
      where.stock = { [Op.gte]: filters.stock };
    }
    if (filters.category) {
      where.category = filters.category;
    }
    if (filters.name) {
      where.name = { [Op.like]: `%${filters.name}%` };
    }
    if (filters.price) {
      where.price = { [Op.lte]: filters.price };
    }

    // Ordenamiento
    if (filters.orderBy) {
      const direction = filters.sortDirection || 'ASC';
      order.push([filters.orderBy, direction]);
    }

    const items = await Item.findAll({ where, order });
    
    // Asegurar que los tipos numéricos sean correctos (mantener compatibilidad)
    return items.map(item => {
      const itemData = item.toJSON();
      return {
        ...itemData,
        price: parseFloat(itemData.price),
        stock: parseInt(itemData.stock)
      };
    });
  },

  create: async (name, price, stock, category) => {
    try {
      const item = await Item.create({ 
        name, 
        price: parseFloat(price), 
        stock: parseInt(stock), 
        category 
      });
      
      const itemData = item.toJSON();
      return {
        ...itemData,
        price: parseFloat(itemData.price),
        stock: parseInt(itemData.stock)
      };
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error("Ya existe un item con ese nombre");
      }
      throw error;
    }
  },

  updateItem: async (id, itemData) => {
    try {
      // Preparar los datos para actualización
      const updateData = {};
      
      if (itemData.name !== undefined) {
        updateData.name = itemData.name;
      }
      if (itemData.price !== undefined) {
        updateData.price = parseFloat(itemData.price);
      }
      if (itemData.stock !== undefined) {
        updateData.stock = parseInt(itemData.stock);
      }
      if (itemData.category !== undefined) {
        updateData.category = itemData.category;
      }
      
      if (Object.keys(updateData).length === 0) {
        throw new Error("No hay datos para actualizar");
      }
      
      const [updatedRows] = await Item.update(updateData, {
        where: { id }
      });
      
      if (updatedRows === 0) {
        return null; // Item no encontrado
      }
      
      // Devolver el item actualizado
      return await itemModelSequelize.getById(id);
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    const result = await Item.destroy({ where: { id } });
    return { changes: result };
  },

  getCategories: async () => {
    const items = await Item.findAll({
      attributes: ['category'],
      group: ['category'],
      where: {
        category: { [Op.ne]: null, [Op.ne]: '' }
      },
      order: [['category', 'ASC']]
    });
    return items.map(item => item.category);
  }
};

// Inicializar items al cargar el módulo (después de que el objeto esté definido)
initItems();

module.exports = itemModelSequelize;
