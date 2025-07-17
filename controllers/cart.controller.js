// Cart controller
const cartService = require("../services/cart.service");
const itemModel = require("../models/item.model.sequelize");

const cartController = {
  // ========== MÉTODOS DE API (JSON) ==========
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

  clearCart: async (req, res) => {
    try {
      const userId = req.session.userId || req.user?.id || null;

      if (!userId) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      const result = await cartService.clearCartByUserId(userId);

      if (result.changes === 0) {
        return res.status(404).json({ message: "Carrito ya está vacío" });
      }

      res.status(200).json({
        message: "Carrito vaciado exitosamente",
        itemsRemoved: result.changes
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({ message: "Error al vaciar el carrito" });
    }
  },

  getCartTotal: async (req, res) => {
    try {
      const userId = req.session.userId || req.user?.id || null;

      if (!userId) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      const cartData = await cartService.getCartTotalAndItems(userId);

      if (!cartData.items || cartData.items.length === 0) {
        return res.status(400).json({ message: "Carrito vacío" });
      }

      // Generar ID único de compra
      const purchaseId = `PUR-${Date.now()}-${userId}`;

      res.status(200).json({
        purchaseId: purchaseId,
        total: cartData.total,
        itemCount: cartData.items.length,
        items: cartData.items,
        user: {
          id: userId,
          name: req.user?.name || req.session?.user?.name || 'Usuario'
        }
      });
    } catch (error) {
      console.error("Error getting cart total:", error);
      res.status(500).json({ message: "Error al calcular el total" });
    }
  },

  processPurchase: async (req, res) => {
    try {
      const { purchaseId } = req.body;
      const userId = req.session.userId || req.user?.id || null;

      if (!userId) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      if (!purchaseId) {
        return res.status(400).json({ message: "ID de compra requerido" });
      }

      // Obtener datos del carrito antes de procesar
      const cartData = await cartService.getCartTotalAndItems(userId);

      if (!cartData.items || cartData.items.length === 0) {
        return res.status(400).json({ message: "Carrito vacío" });
      }

        // VERIFICAR STOCK DISPONIBLE ANTES DE PROCESAR LA COMPRA
        const stockValidation = [];
        for (const cartItem of cartData.items) {
          const currentItem = await itemModel.getById(cartItem.item_id);
          if (!currentItem) {
            return res.status(400).json({
              message: `El producto "${cartItem.name}" ya no está disponible`
            });
          }

          if (currentItem.stock < cartItem.quantity) {
            stockValidation.push({
              name: cartItem.name,
              requested: cartItem.quantity,
              available: currentItem.stock
            });
          }
        }

        // Si hay problemas de stock, devolver error
        if (stockValidation.length > 0) {
          return res.status(400).json({
            message: "Stock insuficiente para algunos productos",
            stockIssues: stockValidation
          });
        }

        // REDUCIR STOCK DE CADA PRODUCTO
        for (const cartItem of cartData.items) {
          const currentItem = await itemModel.getById(cartItem.item_id);
          const newStock = currentItem.stock - cartItem.quantity;

          // Actualizar el stock del producto
          await itemModel.updateItem(cartItem.item_id, { stock: newStock });
        }      // Procesar la compra (aquí podrías agregar lógica de pago real)
      const purchase = await cartService.processPurchase(userId, purchaseId, cartData);

      // Vaciar el carrito después de la compra exitosa
      await cartService.clearCartByUserId(userId);

      res.status(200).json({
        message: "Compra procesada exitosamente",
        purchase: {
          id: purchaseId,
          total: cartData.total,
          itemCount: cartData.items.length,
          date: new Date().toISOString(),
          status: "completed"
        }
      });
    } catch (error) {
      console.error("Error processing purchase:", error);
      res.status(500).json({
        message: "Error al procesar la compra",
        error: error.message
      });
    }
  },

  // ========== MÉTODOS DE VISTA (Vistas) ==========
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

  // ========== MÉTODOS DE MANEJO (Acciones) ==========
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

  // NUEVA FUNCIONALIDAD: Manejar vaciar carrito desde vista
  handleClearCart: async (req, res) => {
    try {
      const userId = req.session.userId || req.user?.id || null;

      if (!userId) {
        return res.redirect("/auth/login?error=Debe iniciar sesión");
      }

      const result = await cartService.clearCartByUserId(userId);

      if (result.changes === 0) {
        return res.redirect("/cart?error=Carrito ya está vacío");
      }

      res.redirect("/cart?success=Carrito vaciado exitosamente");
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.redirect(`/cart?error=${encodeURIComponent("Error al vaciar el carrito")}`);
    }
  },

};

module.exports = cartController;
