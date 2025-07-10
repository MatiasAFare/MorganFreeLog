const cartService = require("../services/cart.service");

const cartController = {
  // ========== API METHODS (JSON) ==========
  getAllItems: async (req, res) => {
    try {
      const userId = req.session.user.id || null;

      if (!userId) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }
      const items = await cartService.getCartItemsByUserId(userId);
      console.log("Items fetched from cart:", items);
      return items;
    } catch (error) {
      console.error("Error fetching cart items:", error);
      res.status(500).json({ message: "Error fetching cart items" });
    }
  },
  createItem: async (req, res) => {},
  updateItem: async (req, res) => {},
  deleteItem: async (req, res) => {},

  // ========== SHOW METHODS (Views) ==========
  showCartItemsList: async (req, res) => {
    console.log("showCartItemsList called");
    console.log("Session user in showCartItemsList:", req.session.user);
    try {
      console.log("user in showcart", req.session.user);
      const items = await cartService.getCartItemsByUserId(req.session.user.id);
      console.log("Items to render in cart:", items);
      res.render("cart/index", { items: items });
    } catch (error) {
      console.error("Error showing items list:", error);
      res.status(500).render("error", { message: "Error showing items list" });
    }
  },
  showEditForm: async (req, res) => {},

  // ========== HANDLE METHODS (Actions) ==========
  handleCreate: async (req, res) => {},
  handleUpdate: async (req, res) => {},
  handleDelete: async (req, res) => {},
};

module.exports = cartController;
