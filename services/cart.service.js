const cartModel = require("../models/cart.model");

const CartService = {
  // Get cart items
  getCartItemsByUserId(id) {
    return cartModel.getByUserId(id);
  },

  // Add item to cart
  addItemToCart() {},

  // Remove item from cart
  removeItemFromCart() {},

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
