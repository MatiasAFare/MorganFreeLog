const cartService = require("../services/cart.service");

const cartController = {
  // ========== API METHODS (JSON) ==========
  getAllItems: async (req, res) => {
    try {
      const userId = req.session.userId || req.user.id || null;

      if (!userId) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }
      const items = await cartService.getCartItemsByUserId(userId);
      res.status(200).json(items);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      res.status(500).json({ message: "Error fetching cart items" });
    }
  },
  deleteItem: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await cartService.removeItemFromCart(id);

      if (result.changes === 0) {
        return res.status(404).json({ message: "Item not found" });
      }

      res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting item", error: error.message });
    }
  },

  // ========== SHOW METHODS (Views) ==========
  showCartItemsList: async (req, res) => {
    try {
      // Usar req.user del middleware checkPermiso, con fallback a sesión
      const userId = req.session.userId || req.user.id || null;

      const success = req.query.success || null;
      const error = req.query.error || null;

      if (!userId) {
        return res.render("cart/index", {
          items: [],
          error: error || "Debe iniciar sesión para ver su carrito",
          success: success,
        });
      }

      const items = await cartService.getCartItemsByUserId(userId);
      res.render("cart/index", { items, error: error, success: success });
    } catch (error) {
      console.error("Error showing items list:", error);
      res.render("cart/index", {
        items: [],
        error: req.query.error || "Error al cargar los items del carrito",
        success: req.query.success || null,
      });
    }
  },

  // ========== HANDLE METHODS (Actions) ==========
  handleCreate: async (req, res) => {
    try {
      const { item_id, quantity } = req.body;
      const userId = req.session.userId || req.user.id || null;

      if (!userId) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      if (!item_id || !quantity) {
        return res.status(400).json({ message: "Datos incompletos" });
      }

      await cartService.addItemToCart(userId, item_id, quantity);

      res.redirect("/shop?success=Producto agregado al carrito exitosamente");
    } catch (error) {
      console.error("Error adding item to cart:", error);
      res.redirect("/shop?error=Error al agregar el producto al carrito");
    }
  },
  handleDelete: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await cartService.removeItemFromCart(id);

      if (result.changes === 0) {
        return res.redirect("/cart?error=Item no encontrado");
      }

      res.redirect("/cart?success=Item eliminado del carrito exitosamente");
    } catch (error) {
      res.redirect(`/cart?error=${encodeURIComponent(error.message)}`);
    }
  },
};

module.exports = cartController;
