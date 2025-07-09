const itemModel = require("../models/item.model.js");

const shopService = {
  getAllItems: async (filters) => {
    // Aquí se implementaría la lógica para obtener todos los items
    // con los filtros de búsqueda y ordenación aplicados.
    return itemModel.getAll(filters);
  },
  getItemById: async (id) => {
    // Aquí se implementaría la lógica para obtener un item por su ID.
    //Lucas
    return null;
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
  updateItem: async (id, itemData) => {
    // Aquí se implementaría la lógica para actualizar un item existente.
    // Debería validar los datos y luego actualizar el item en la base de datos.
    try {
      // Validar que el item existe
      const existingItem = await itemModel.getById(id);
      if (!existingItem) {
        throw new Error('Item no encontrado');
      }

      // Validar datos requeridos
      if (itemData.name && itemData.name.trim() === '') {
        throw new Error('El nombre del item es requerido');
      }
      if (itemData.price && itemData.price < 0) {
        throw new Error('El precio debe ser mayor o igual a 0');
      }
      if (itemData.stock && itemData.stock < 0) {
        throw new Error('El stock debe ser mayor o igual a 0');
      }

      // Actualizar el item en la base de datos
      const updatedItem = await itemModel.updateItem(id, itemData);
      return updatedItem;
    } catch (error) {
      console.error('Error en updateItem service:', error);
      throw error;
    }
  },
  deleteItem: async (id) => {
    // Aquí se implementaría la lógica para eliminar un item por su ID.
    // Debería verificar que el item existe y luego eliminarlo de la base de datos.
    //Lucas
    return {
      success: true,
      message: `Item with ID ${id} deleted successfully.`,
    };
  },
};
module.exports = shopService;
