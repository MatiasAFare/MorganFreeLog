const express = require("express");
const router = express.Router();
const permisosController = require("../controllers/permisos.controller");
const { checkPermiso } = require("../middleware/checkPermiso.middleware");

// ========== RUTAS API (JSON) ==========
router.get("/api", permisosController.getPermisos);
router.get("/api/:id", permisosController.getPermisoById);
router.post(
  "/api",
  checkPermiso("GESTIONAR PERMISOS"),
  permisosController.createPermiso
);
router.put(
  "/api/:id",
  checkPermiso("GESTIONAR PERMISOS"),
  permisosController.updatePermiso
);
router.delete(
  "/api/:id",
  checkPermiso("GESTIONAR PERMISOS"),
  permisosController.deletePermiso
);

// ========== RUTAS DE VISTA (HTML) ==========
router.get("/", permisosController.showPermisosList); // Lista de permisos
router.get(
  "/new",
  checkPermiso("GESTIONAR PERMISOS"),
  permisosController.showCreateForm
); // Formulario de creación
router.get(
  "/:id/edit",
  checkPermiso("GESTIONAR PERMISOS"),
  permisosController.showEditForm
); // Formulario de edición

// ========== RUTAS DE ACCIÓN (POST) ==========
router.post(
  "/",
  checkPermiso("GESTIONAR PERMISOS"),
  permisosController.handleCreate
); // Procesar creación
router.post(
  "/:id/edit",
  checkPermiso("GESTIONAR PERMISOS"),
  permisosController.handleUpdate
); // Procesar edición
router.post(
  "/:id/delete",
  checkPermiso("GESTIONAR PERMISOS"),
  permisosController.handleDelete
); // Eliminar permiso

module.exports = router;
