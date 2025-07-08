const db = require("../database");

const insertDefaultItems = () => {
  const items = [
    { name: "Item 1", price: 10.0, stock: 100, category: "Category A" },
    { name: "Item 2", price: 20.0, stock: 50, category: "Category B" },
    { name: "Item 3", price: 15.0, stock: 75, category: "Category A" },
    { name: "Item 4", price: 30.0, stock: 20, category: "Category C" },
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
  getById: async () => {},
  //Filtros de búsqueda: Stock, Categoría, Nombre, Precio
  //Ordenación: Nombre, Precio, Stock
  //Lucas
  getAll: async () => {
    const stmt = db.prepare("SELECT * FROM items");
    return stmt.all();
  },
  //Lazaro
  create: async () => {},
  //Mati
  update: async () => {},
  //Lucas
  delete: async () => {},
};

module.exports = itemModel;
