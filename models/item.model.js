const db = require("../database");

const insertDefaultItems = () => {
  const items = [
    { id: 1, name: "Item 1", price: 10.0, stock: 100, category: "Category A" },
    { id: 2, name: "Item 2", price: 20.0, stock: 50, category: "Category B" },
    { id: 3, name: "Item 3", price: 15.0, stock: 75, category: "Category A" },
    { id: 4, name: "Item 4", price: 30.0, stock: 20, category: "Category C" },
  ];
  const stmt = db.prepare(
    "INSERT OR IGNORE INTO items (name, price, stock, category) VALUES (?, ?, ?, ?)"
  );
  items.forEach((item) => {
    stmt.run(item.name, item.price, item.stock, item.category);
  });
};

const initItems = () => {
  const row = db.prepare("SELECT COUNT(*) as count FROM items").get();

  if (row.count === 0) {
    console.log("Semillando la base de datos con items por defecto...");
    insertDefaultItems();
  }
};

initItems();

const itemModel = {
  getById: (id) => {
    const stmt = db.prepare("SELECT * FROM items WHERE id = ?");
    return stmt.get(id);
  },

  getAll: (filters) => {
    let query = "SELECT * FROM items";
    const params = [];
    const whereClauses = [];
    const orderByClauses = [];
    const { stock, category, name, price, orderBy, sortDirection } = filters;
    
    if (stock) {
      whereClauses.push("stock >= ?");
      params.push(stock);
    }
    if (category) {
      whereClauses.push("category = ?");
      params.push(category);
    }
    if (name) {
      whereClauses.push("name LIKE ?");
      params.push(`%${name}%`);
    }
    if (price) {
      whereClauses.push("price <= ?");
      params.push(price);
    }
    if (whereClauses.length > 0) {
      query += " WHERE " + whereClauses.join(" AND ");
    }
    if (orderBy) {
      const direction = sortDirection || 'ASC';
      switch (orderBy) {
        case "name":
          orderByClauses.push(`name ${direction}`);
          break;
        case "price":
          orderByClauses.push(`price ${direction}`);
          break;
        case "stock":
          orderByClauses.push(`stock ${direction}`);
          break;
        default:
          break;
      }
    }
    if (orderByClauses.length > 0) {
      query += " ORDER BY " + orderByClauses.join(", ");
    }
    const stmt = db.prepare(query);

    return stmt.all(params);
  },
  create: (name, price, stock, category) => {
    try {
      const stmt = db.prepare(
        "INSERT INTO items (name, price, stock, category) VALUES (?, ?, ?, ?)"
      );
      const result = stmt.run(name, price, stock, category);
      return { id: result.lastInsertRowid, name, price, stock, category };
    } catch (error) {
      if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
        throw new Error("Ya existe un item con ese nombre");
      }
      throw error;
    }
  },
  //Mati
  update: async () => {},
  //Lucas
  delete: (id) => {
    const stmt = db.prepare("DELETE FROM items WHERE id = ?");
    return stmt.run(id);
  },
};

module.exports = itemModel;
