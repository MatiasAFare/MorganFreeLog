const db = require("../database");

const insertDefaultCartItems = () => {
  const cartItems = [
    { id: 1, user_id: 1, item_id: 1, quantity: 2 },
    { id: 3, user_id: 2, item_id: 2, quantity: 3 },
  ];
  const stmt = db.prepare(
    "INSERT OR IGNORE INTO cart (user_id, item_id, quantity) VALUES (?, ?, ?)"
  );
  cartItems.forEach((cartItem) => {
    stmt.run(cartItem.user_id, cartItem.item_id, cartItem.quantity);
  });
};

const initCart = () => {
  const row = db.prepare("SELECT COUNT(*) as count FROM cart").get();

  if (row.count === 0) {
    console.log(
      "Semillando la base de datos con items del carrito por defecto..."
    );
    insertDefaultCartItems();
  }
};

const cartModel = {
  getByUserId: (user_id) => {
    const stmt = db.prepare(`
      SELECT c.id, c.user_id, c.item_id, c.quantity, 
             i.name, i.price 
      FROM cart c 
      JOIN items i ON c.item_id = i.id 
      WHERE c.user_id = ?
    `);
    return stmt.all(user_id);
  },

  create: (user_id, item_id, quantity) => {
    const stmt = db.prepare(
      "INSERT INTO cart (user_id, item_id, quantity) VALUES (?, ?, ?)"
    );
    return stmt.run(user_id, item_id, quantity);
  },

  update: (id, quantity) => {
    const stmt = db.prepare("UPDATE cart SET quantity = ? WHERE id = ?");
    return stmt.run(quantity, id);
  },

  delete: (id) => {
    const stmt = db.prepare("DELETE FROM cart WHERE id = ?");
    return stmt.run(id);
  },

  findByUserAndItem: (user_id, item_id) => {
    const stmt = db.prepare(
      "SELECT * FROM cart WHERE user_id = ? AND item_id = ?"
    );
    return stmt.get(user_id, item_id);
  },

  // Nuevo método para vaciar carrito completo por usuario
  clearByUserId: (user_id) => {
    const stmt = db.prepare("DELETE FROM cart WHERE user_id = ?");
    return stmt.run(user_id);
  },
};

module.exports = cartModel;
