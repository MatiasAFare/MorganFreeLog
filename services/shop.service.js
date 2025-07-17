// Shop service
const itemModel = require("../models/item.model.sequelize");

const shopService = {
  getAllItems: async (filters) => {
    return await itemModel.getAll(filters);
  },
  getItemById: async (id) => {
    return await itemModel.getById(id);
  },
  createItem: async (name, price, stock, category) => {
    return await itemModel.create(name, price, stock, category);
  },
  updateItem: async (id, itemData) => {
    try {
      const existingItem = await itemModel.getById(id);
      if (!existingItem) {
        throw new Error("Item no encontrado");
      }
      if (itemData.name && itemData.name.trim() === "") {
        throw new Error("El nombre del item es requerido");
      }
      if (itemData.price && itemData.price < 0) {
        throw new Error("El precio debe ser mayor o igual a 0");
      }
      if (itemData.stock && itemData.stock < 0) {
        throw new Error("El stock debe ser mayor o igual a 0");
      }
      const updatedItem = await itemModel.updateItem(id, itemData);
      return updatedItem;
    } catch (error) {
      console.error("Error en updateItem service:", error);
      throw error;
    }
  },
  deleteItem: async (id) => {
    const item = await itemModel.getById(id);
    if (!item) {
      return {
        success: false,
        message: `Item with ID ${id} not found.`,
      };
    }

    try {
      const result = await itemModel.delete(id);
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
  getCategories: async () => {
    return await itemModel.getCategories();
  },
};
module.exports = shopService;
