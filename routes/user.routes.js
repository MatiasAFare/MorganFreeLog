// User routes
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { checkPermiso } = require("../middleware/checkPermiso.middleware");

// ========== RUTAS API (JSON) ==========
router.post('/:id/edit', checkPermiso('GESTIONAR USUARIOS'), userController.updateUser); // Actualizar un usuario

// ========== RUTAS DE VISTA (HTML) ==========
router.get('/', userController.showUsersList); // Lista de usuarios
router.get('/new', userController.showCreateForm); // Formulario de creación
router.get('/:id', userController.showDetails); // Ver detalles de un usuario
router.get('/:id/edit', checkPermiso('GESTIONAR USUARIOS'), userController.showEditForm); // Formulario de edición
router.post('/:id/delete', checkPermiso('GESTIONAR USUARIOS'), userController.handleDelete); // Eliminar un usuario (vista)


// ========== RUTAS DE ACCIÓN (POST) ==========
router.post('/', userController.handleCreate); // Crear un nuevo usuario



module.exports = router;
