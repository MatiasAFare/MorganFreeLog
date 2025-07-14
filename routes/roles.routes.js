const express = require("express");
const router = express.Router();
const rolesController = require("../controllers/roles.controller");
const { checkPermiso } = require("../middleware/checkPermiso.middleware");

// ========== RUTAS API (JSON) ==========
router.get("/api", rolesController.getRoles);
router.get("/api/:id", rolesController.getRolById);
router.post("/api", checkPermiso("GESTIONAR ROLES"), rolesController.createRol);
router.put(
  "/api/:id",
  checkPermiso("GESTIONAR ROLES"),
  rolesController.updateRol
);
router.delete(
  "/api/:id",
  checkPermiso("GESTIONAR ROLES"),
  rolesController.deleteRol
);

// ========== RUTAS DE VISTA (HTML) ==========
router.get("/", rolesController.showRolesList); // Lista de roles
router.get(
  "/new",
  checkPermiso("GESTIONAR ROLES"),
  rolesController.showCreateForm
); // Formulario de creación
router.get("/:id", rolesController.showDetails); // Ver detalles de un rol
router.get(
  "/:id/edit",
  checkPermiso("GESTIONAR ROLES"),
  rolesController.showEditForm
); // Formulario de edición

// ========== RUTAS DE ACCIÓN (POST) ==========
router.post("/", checkPermiso("GESTIONAR ROLES"), rolesController.handleCreate); // Procesar creación
router.post(
  "/:id/edit",
  checkPermiso("GESTIONAR ROLES"),
  rolesController.handleUpdate
); // Procesar edición
router.post(
  "/:id/delete",
  checkPermiso("GESTIONAR ROLES"),
  rolesController.handleDelete
); // Eliminar rol

module.exports = router;
