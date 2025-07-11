const express = require("express");
const cartController = require("../controllers/cart.controller");
const { checkPermiso } = require("../middleware/checkPermiso.middleware");
const router = express.Router();

// ========== API ROUTES (JSON) ==========
router.get("/api", checkPermiso("LOGIN"), cartController.getAllItems);
router.delete("/api/:id", checkPermiso("LOGIN"), cartController.deleteItem);

// ========== VIEW ROUTES (HTML) ==========
router.get("/", checkPermiso("LOGIN"), cartController.showCartItemsList); // Lista de productos en el carrito

// ========== ACTION ROUTES (POST) ==========
router.post("/", checkPermiso("LOGIN"), cartController.handleCreate); // Procesar agregar al carrito
router.post("/:id/delete", checkPermiso("LOGIN"), cartController.handleDelete); // Procesar eliminar del carrito

module.exports = router;
