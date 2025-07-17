// Cart service
const cartModel = require("../models/cart.model.sequelize");

const CartService = {
  async getCartItemsByUserId(id) {
    return await cartModel.getByUserId(id);
  },

  async addItemToCart(userId, itemId, quantity) {
    const existingItem = await cartModel.findByUserAndItem(userId, itemId);
    if (existingItem) {
      const newQuantity = parseInt(existingItem.quantity) + parseInt(quantity);
      return await cartModel.update(existingItem.id, newQuantity);
    } else {
      return await cartModel.create(userId, itemId, quantity);
    }
  },

  async removeItemFromCart(itemId) {
    return await cartModel.delete(itemId);
  },

  async updateItemQuantity() {},

  async clearCartByUserId(userId) {
    return await cartModel.clearByUserId(userId);
  },

  async getCartTotalAndItems(userId) {
    const items = await cartModel.getByUserId(userId);
    const total = items.reduce((sum, item) => {
      return sum + parseFloat(item.price || 0) * parseInt(item.quantity || 0);
    }, 0);

    return {
      items: items,
      total: parseFloat(total.toFixed(2)),
    };
  },

  async processPurchase(userId, purchaseId, cartData) {
    return {
      id: purchaseId,
      userId: userId,
      items: cartData.items,
      total: cartData.total,
      date: new Date(),
      status: "completed",
    };
  },

  getCartItemCount(userId) {
    const items = cartModel.getByUserId(userId);
    return items.reduce(
      (total, item) => total + parseInt(item.quantity || 0),
      0
    );
  },
};

module.exports = CartService;
