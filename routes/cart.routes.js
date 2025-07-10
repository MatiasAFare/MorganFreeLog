const express = require("express");
const cartController = require("../controllers/cart.controller");
const router = express.Router();

// ========== API ROUTES (JSON) ==========
router.get("/", cartController.getAllItems);
router.get("/:id/edit", cartController.showEditForm);

// ========== VIEW ROUTES (HTML) ==========
router.get("/", cartController.showCartItemsList); // Lista de productos en el carrito
router.get("/:id/edit", cartController.showEditForm); // Formulario de edición del carrito

// ========== ACTION ROUTES (POST) ==========
router.post("/", cartController.handleCreate); // Procesar agregar al carrito
router.post("/:id/edit", cartController.handleUpdate); // Procesar eliminar del carrito
router.post("/:id/delete", cartController.handleDelete); // Procesar eliminar del carrito

module.exports = router;
