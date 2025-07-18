// Shop routes
const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shop.controller");
const { checkPermiso } = require("../middleware/checkPermiso.middleware");

// ========== RUTAS API (JSON) ==========
router.get("/shop", shopController.getAllItems); // Obtener todos los items
router.get("/shop/:id", shopController.getItemById); // Obtener un item por ID
router.post(
  "/shop",
  checkPermiso("GESTIONAR ITEMS"),
  shopController.createItem
); // Crear un nuevo item
router.put(
  "/shop/:id",
  checkPermiso("GESTIONAR ITEMS"),
  shopController.updateItem
); // Actualizar un item
router.delete(
  "/shop/:id",
  checkPermiso("GESTIONAR ITEMS"),
  shopController.deleteItem
); // Eliminar un item

// ========== RUTAS DE VISTA (HTML) ==========
router.get("/", checkPermiso("LOGIN"), shopController.showItemsList); // Lista de items
router.get(
  "/items-new",
  checkPermiso("GESTIONAR ITEMS"),
  shopController.showCreateForm
); // Formulario de creación
router.get("/:id", checkPermiso("LOGIN"), shopController.showDetails); // Ver detalles de un item
router.get(
  "/:id/edit",
  checkPermiso("GESTIONAR ITEMS"),
  shopController.showEditForm
); // Formulario de edición

// ========== RUTAS DE ACCIÓN (POST) ==========
router.post("/", checkPermiso("GESTIONAR ITEMS"), shopController.handleCreate); // Procesar creación
router.post(
  "/:id/edit",
  checkPermiso("GESTIONAR ITEMS"),
  shopController.handleUpdate
); // Procesar edición
router.post(
  "/:id/delete",
  checkPermiso("GESTIONAR ITEMS"),
  shopController.handleDelete
); // Eliminar item

module.exports = router;
