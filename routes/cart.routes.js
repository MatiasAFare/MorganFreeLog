// Cart routes
const express = require("express");
const cartController = require("../controllers/cart.controller");
const { checkPermiso } = require("../middleware/checkPermiso.middleware");
const router = express.Router();

// ========== RUTAS API (JSON) ==========
router.get("/api", checkPermiso("LOGIN"), cartController.getAllItems);
router.delete("/api/:id", checkPermiso("LOGIN"), cartController.deleteItem);
router.delete("/api/clear", checkPermiso("LOGIN"), cartController.clearCart); // Vaciar carrito completo
router.get("/api/total", checkPermiso("LOGIN"), cartController.getCartTotal); // Obtener total para modal
router.post("/api/purchase", checkPermiso("LOGIN"), cartController.processPurchase); // Procesar compra

// ========== RUTAS DE VISTA (HTML) ==========
router.get("/", checkPermiso("LOGIN"), cartController.showCartItemsList); // Lista de productos en el carrito

// ========== RUTAS DE ACCIÓN (POST) ==========
router.post("/", checkPermiso("LOGIN"), cartController.handleCreate); // Procesar agregar al carrito
router.post("/:id/delete", checkPermiso("LOGIN"), cartController.handleDelete); // Procesar eliminar del carrito
router.post("/clear", checkPermiso("LOGIN"), cartController.handleClearCart); // Vaciar carrito desde vista

module.exports = router;
