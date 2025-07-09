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
    try {
      const itemId = req.params.id;
      const item = await shopService.getItemById(itemId);
      if (!item) {
        return res.status(404).json({ message: "Item no encontrado" });
      }
      return item;
    } catch (error) {
      console.error("Error al obtener el item:", error);
      res.status(500).json({ message: "Error al obtener el item" });
    }
    //Lucas
  },
  createItem: async (req, res) => {
    // Lógica para crear un nuevo item
    //Lazaro
  },
  updateItem: async (req, res) => {
    // Lógica para actualizar un item
    //Mati
  },
  deleteItem: async (req, res) => {
    // Lógica para eliminar un item
    try {
      const itemId = req.params.id;
      const result = await shopService.deleteItem(itemId);
      if (result.success) {
        return res.status(200).json({ message: result.message });
      } else {
        return res.status(404).json({ message: "Item no encontrado" });
      }
    } catch (error) {
      console.error("Error al eliminar el item:", error);
      res.status(500).json({ message: "Error al eliminar el item" });
    }
    //Lucas
  },

  // ========== SHOW METHODS (Views) ==========
  showItemsList: async (req, res) => {
    // Lógica para mostrar la lista de items
    try {
      // Aquí se llamaría al servicio para obtener los items
      const filters = req.query;
      const items = await shopController.getAllItems(req, res);
      res.render("shop/items-list", {
        title: "Lista de Items",
        items: items,
        error: req.query.error,
        success: req.query.success,
        // Pasar los filtros actuales a la vista
        name: filters.name || '',
        price: filters.price || '',
        stock: filters.stock || '',
        category: filters.category || '',
        orderBy: filters.orderBy || '',
        sortDirection: filters.sortDirection || ''
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
  showCreateForm: (req, res) => {
    // Lógica para mostrar el formulario de creación de un nuevo item
    //Lazaro
  },
  showDetails: async (req, res) => {
    // Lógica para mostrar los detalles de un item
    //Mati
    const item = await shopController.getItemById(req, res);
    if (!item) {
      return res.status(404).render("error", {
        message: "Item no encontrado",
      });
    }
    res.render("shop/item-details", {
      title: "Detalles del Item",
      item: item,
      error: req.query.error,
    });

  },
  showEditForm: (req, res) => {
    // Lógica para mostrar el formulario de edición de un item
    //Lucas
  },

  // ========== HANDLE METHODS (Actions) ==========
  handleCreate: async (req, res) => {
    // Lógica para procesar la creación de un nuevo item
    //Lazaro
  },
  handleUpdate: async (req, res) => {
    // Lógica para procesar la actualización de un item
    //Matixxxxxxxxxxxx
  },
  handleDelete: async (req, res) => {
    // Lógica para procesar la eliminación de un item
    //Lucas
    const itemId = req.params.id;
    try {
      const result = shopService.deleteItem(itemId);
      if (result.success) {
        // Redirigir con mensaje de éxito
        return res.redirect('/shop?success=Item eliminado correctamente');
      } else {
        // Redirigir con mensaje de error
        return res.redirect('/shop?error=Item no encontrado');
      }
    } catch (error) {
      console.error("Error al eliminar el item:", error);
      return res.redirect('/shop?error=Error al eliminar el item');
    }
  },
};

module.exports = shopController;
