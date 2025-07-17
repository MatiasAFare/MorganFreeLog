// User routes
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { checkPermiso } = require("../middleware/checkPermiso.middleware");

// ========== RUTAS DE VISTA (HTML) ==========
router.get('/', userController.showUsersList); // Lista de usuarios
router.get('/new', userController.showCreateForm); // Formulario de creación
router.get('/:id', userController.showDetails); // Ver detalles de un usuario
router.get('/:id/edit', checkPermiso('GESTIONAR USUARIOS'), userController.showEditForm); // Formulario de edición

// ========== RUTAS API (JSON) ==========
router.post('/', checkPermiso('GESTIONAR USUARIOS'), userController.createUser); // Crear un nuevo usuario
router.post('/:id/edit', checkPermiso('GESTIONAR USUARIOS'), userController.updateUser); // Actualizar un usuario
router.post('/:id/delete', checkPermiso('GESTIONAR USUARIOS'), userController.deleteUser); // Eliminar un usuario

module.exports = router;
