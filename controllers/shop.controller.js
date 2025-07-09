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
    try {
      const { id } = req.params;
      const itemData = req.body;

      const updatedItem = await shopService.updateItem(id, itemData);

      if (!updatedItem) {
        return res.status(404).json({ message: "Item no encontrado" });
      }

      res.status(200).json({
        message: "Item actualizado exitosamente",
        item: updatedItem
      });
    } catch (error) {
      console.error("Error al actualizar el item:", error);
      res.status(500).json({
        message: "Error al actualizar el item",
        error: error.message
      });
    }
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
  showCreateForm: async (req, res) => {
    res.render("shop/new", { error: null });
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
    try {
      const { id } = req.params;
      const itemData = req.body;

      const updatedItem = await shopService.updateItem(id, itemData);

      if (!updatedItem) {
        return res.render("shop/edit", {
          error: "Item no encontrado",
          item: { id, ...itemData }
        });
      }

      res.redirect(`/shop/${id}`);
    } catch (error) {
      console.error("Error al actualizar el item:", error);
      res.render("shop/edit", {
        error: "Error al actualizar el item: " + error.message,
        item: { id: req.params.id, ...req.body }
      });
    }
  },
  handleDelete: async (req, res) => {
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
