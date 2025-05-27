const express = require("express");
const router = express.Router();
const permisosController = require("../controllers/permiso.controller");
const checkPermiso = require("../middleware/checkPermiso.middleware");

// ========== API ROUTES (JSON) ==========
router.get("/api", permisosController.getPermisos);
router.get("/api/:id", permisosController.getPermisoById);
router.post(
  "/api",
  checkPermiso("gestionar_permisos"),
  permisosController.createPermiso
);
router.put(
  "/api/:id",
  checkPermiso("gestionar_permisos"),
  permisosController.updatePermiso
);
router.delete(
  "/api/:id",
  checkPermiso("gestionar_permisos"),
  permisosController.deletePermiso
);

// ========== VIEW ROUTES (HTML) ==========
router.get("/", permisosController.showPermisosList); // Lista de permisos
router.get("/new", permisosController.showCreateForm); // Formulario de creación
router.get(
  "/:id/edit",
  checkPermiso("gestionar_permisos"),
  permisosController.showEditForm
); // Formulario de edición

// ========== ACTION ROUTES (POST) ==========
router.post("/", permisosController.handleCreate); // Procesar creación
router.post(
  "/:id/edit",
  checkPermiso("gestionar_permisos"),
  permisosController.handleUpdate
); // Procesar edición
router.post(
  "/:id/delete",
  checkPermiso("gestionar_permisos"),
  permisosController.handleDelete
); // Eliminar permiso

module.exports = router;
