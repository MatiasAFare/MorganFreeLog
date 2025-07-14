const cartModel = require("../models/cart.model");

const CartService = {
  // Get cart items
  getCartItemsByUserId(id) {
    return cartModel.getByUserId(id);
  },

  // Add item to cart
  addItemToCart(userId, itemId, quantity) {
    // Verificar si el item ya existe en el carrito
    const existingItem = cartModel.findByUserAndItem(userId, itemId);

    if (existingItem) {
      // Si ya existe, aumentar la cantidad
      const newQuantity = parseInt(existingItem.quantity) + parseInt(quantity);
      return cartModel.update(existingItem.id, newQuantity);
    } else {
      // Si no existe, crear nuevo item
      return cartModel.create(userId, itemId, quantity);
    }
  },

  // Remove item from cart
  removeItemFromCart(itemId) {
    return cartModel.delete(itemId);
  },

  // Update item quantity
  updateItemQuantity() {},

  // Clear cart
  clearCart() {},

  // Get cart total
  getCartTotal() {},

  // Get cart item count
  getCartItemCount() {},
};

module.exports = CartService;
