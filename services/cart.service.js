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
  updateItemQuantity() { },

  // Clear cart
  clearCartByUserId(userId) {
    return cartModel.clearByUserId(userId);
  },

  // Get cart total and items
  getCartTotalAndItems(userId) {
    const items = cartModel.getByUserId(userId);
    const total = items.reduce((sum, item) => {
      return sum + (parseFloat(item.price || 0) * parseInt(item.quantity || 0));
    }, 0);

    return {
      items: items,
      total: parseFloat(total.toFixed(2))
    };
  },

  // Process purchase
  processPurchase(userId, purchaseId, cartData) {
    // Aquí podrías agregar lógica para guardar la compra en una tabla de órdenes
    // Por ahora solo retornamos los datos procesados
    return {
      id: purchaseId,
      userId: userId,
      items: cartData.items,
      total: cartData.total,
      date: new Date(),
      status: 'completed'
    };
  },

  // Get cart item count
  getCartItemCount(userId) {
    const items = cartModel.getByUserId(userId);
    return items.reduce((total, item) => total + parseInt(item.quantity || 0), 0);
  },
};

module.exports = CartService;
