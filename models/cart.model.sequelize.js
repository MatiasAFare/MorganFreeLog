const Cart = require('./sequelize/cart.model');
const sequelize = require('../config/sequelize');

// Función para inicializar datos por defecto del carrito
const insertDefaultCartItems = async () => {
  const cartItems = [
    { user_id: 1, item_id: 1, quantity: 2 },
    { user_id: 2, item_id: 2, quantity: 3 },
  ];
  
  for (const cartItem of cartItems) {
    try {
      const existingItem = await Cart.findOne({
        where: {
          user_id: cartItem.user_id,
          item_id: cartItem.item_id
        }
      });
      
      if (!existingItem) {
        await Cart.create(cartItem);
      }
    } catch (error) {
      console.error(`Error al crear item del carrito:`, error.message);
    }
  }
};

const initCart = async () => {
  try {
    const count = await Cart.count();
    if (count === 0) {
      console.log("Semillando la base de datos con items del carrito por defecto...");
      await insertDefaultCartItems();
    }
  } catch (error) {
    console.error("Error al inicializar carrito:", error.message);
  }
};

const cartModelSequelize = {
  getByUserId: async (user_id) => {
    const cartItems = await sequelize.query(
      `SELECT c.id, c.user_id, c.item_id, c.quantity, 
              i.name, i.price 
       FROM cart c 
       JOIN items i ON c.item_id = i.id 
       WHERE c.user_id = ?`,
      {
        replacements: [user_id],
        type: sequelize.QueryTypes.SELECT
      }
    );
    
    return cartItems;
  },

  create: async (user_id, item_id, quantity) => {
    const cartItem = await Cart.create({ user_id, item_id, quantity });
    return cartItem.toJSON();
  },

  update: async (id, quantity) => {
    const [updatedRows] = await Cart.update(
      { quantity },
      { where: { id } }
    );
    
    return { changes: updatedRows };
  },

  delete: async (id) => {
    const result = await Cart.destroy({ where: { id } });
    return { changes: result };
  },

  findByUserAndItem: async (user_id, item_id) => {
    const cartItem = await Cart.findOne({
      where: { user_id, item_id }
    });
    
    return cartItem ? cartItem.toJSON() : null;
  },

  clearByUserId: async (user_id) => {
    const result = await Cart.destroy({ where: { user_id } });
    return { changes: result };
  }
};

// Inicializar datos por defecto del carrito
initCart();

module.exports = cartModelSequelize;
