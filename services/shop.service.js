const itemModel = require("../models/item.model.js");

const shopService = {
  getAllItems: async (filters) => {
    // Aquí se implementaría la lógica para obtener todos los items
    // con los filtros de búsqueda y ordenación aplicados.
    return itemModel.getAll(filters);
  },
  getItemById: (id) => {
    return itemModel.getById(id);
  },
  createItem: async (name, price, stock, category) => {
    // Aquí se implementaría la lógica para crear un nuevo item.
    // Debería validar los datos y luego guardarlos en la base de datos.
    //Lazaro
    return {
      id: "new-item-id", // Simulación de ID generado
      name,
      price,
      stock,
      category,
    };
  },
  updateItem: async (id, name, price, stock, category) => {
    // Aquí se implementaría la lógica para actualizar un item existente.
    // Debería validar los datos y luego actualizar el item en la base de datos.
    //Matixxxxxxx
    return {
      id,
      name,
      price,
      stock,
      category,
    };
  },
  deleteItem: (id) => {
    const item = itemModel.getById(id);
    if (!item) {
      return {
        success: false,
        message: `Item with ID ${id} not found.`,
      };
    }

    try {
      const result = itemModel.delete(id);
      if (result.changes > 0) {
        return {
          success: true,
          message: `Item with ID ${id} deleted successfully.`,
        };
      } else {
        return {
          success: false,
          message: `Item with ID ${id} not found.`,
        };
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      return {
        success: false,
        message: `Error deleting item with ID ${id}: ${error.message}`,
      };
    }
  },
};
module.exports = shopService;
