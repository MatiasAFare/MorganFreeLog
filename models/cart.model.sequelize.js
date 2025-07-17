// Cart model adapter
const Cart = require("./sequelize/cart.model");
const sequelize = require("../config/sequelize");

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
        type: sequelize.QueryTypes.SELECT,
      }
    );

    return cartItems;
  },

  create: async (user_id, item_id, quantity) => {
    const cartItem = await Cart.create({ user_id, item_id, quantity });
    return cartItem.toJSON();
  },

  update: async (id, quantity) => {
    const [updatedRows] = await Cart.update({ quantity }, { where: { id } });

    return { changes: updatedRows };
  },

  delete: async (id) => {
    const result = await Cart.destroy({ where: { id } });
    return { changes: result };
  },

  findByUserAndItem: async (user_id, item_id) => {
    const cartItem = await Cart.findOne({
      where: { user_id, item_id },
    });

    return cartItem ? cartItem.toJSON() : null;
  },

  clearByUserId: async (user_id) => {
    const result = await Cart.destroy({ where: { user_id } });
    return { changes: result };
  },
};

module.exports = cartModelSequelize;
