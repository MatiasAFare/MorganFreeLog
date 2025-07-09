const shopService = require("../services/shop.service");

const shopController = {
  // ========== API METHODS (JSON) ==========
  getAllItems: async (req, res) => {
    // Lógica para obtener todos los items
    try {
      const filters = req.query;
      const items = await shopService.getAllItems(filters);
      return items;
    } catch (error) {
      console.error("Error al obtener los items:", error);
      res.status(500).json({ message: "Error al obtener los items" });
    }
  },
  getItemById: async (req, res) => {
    // Lógica para obtener un item por ID
    //Lucas
  },
  createItem: async (req, res) => {
    try {
      const { name, price, stock, category } = req.body;

      if (!name || !price) {
        return res.status(400).json({ message: "Name and price are required" });
      }

      const result = await shopService.createItem(name, price, stock, category);
      res.status(201).json({
        message: "Item created successfully",
        item: result,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating item", error: error.message });
    }
  },
  updateItem: async (req, res) => {
    // Lógica para actualizar un item
    //Mati
  },
  deleteItem: async (req, res) => {
    // Lógica para eliminar un item
    //Lucas
  },

  // ========== SHOW METHODS (Views) ==========
  showItemsList: async (req, res) => {
    // Lógica para mostrar la lista de items
    try {
      // Aquí se llamaría al servicio para obtener los items
      const items = await shopController.getAllItems(req, res);
      res.render("shop/items-list", {
        title: "Lista de Items",
        items: items,
        error: req.query.error,
      });
    } catch (error) {
      console.error("Error al obtener la lista de items:", error);
      // En caso de error, se puede redirigir a una página de error o mostrar un mensaje
      return res.render("error", {
        message: "Error al cargar la lista de items",
        error: error.message,
      });
    }
  },
  showCreateForm: async (req, res) => {
    res.render("shop/new", { error: null });
  },
  showDetails: (req, res) => {
    // Lógica para mostrar los detalles de un item
    //Mati
  },
  showEditForm: (req, res) => {
    // Lógica para mostrar el formulario de edición de un item
    //Lucas
  },

  // ========== HANDLE METHODS (Actions) ==========
  handleCreate: async (req, res) => {
    try {
      const { name, price, stock, category } = req.body;

      if (!name || !price) {
        return res.render("shop/new", {
          error: "El nombre y el precio son requeridos",
          item: { name, price, stock, category },
        });
      }

      await shopService.createItem(name, price, stock, category);
      res.redirect("/shop");
    } catch (error) {
      res.render("shop/new", {
        error: error.message,
        item: req.body,
      });
    }
  },

  handleUpdate: async (req, res) => {
    // Lógica para procesar la actualización de un item
    //Matixxxxxxxxxxxx
  },
  handleDelete: async (req, res) => {
    // Lógica para procesar la eliminación de un item
    //Lucas
  },
};

module.exports = shopController;
