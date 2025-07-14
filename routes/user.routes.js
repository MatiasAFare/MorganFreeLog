const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { checkPermiso } = require('../middleware/checkPermiso.middleware');

// ========== RUTAS API (JSON) ==========
router.get('/api', userController.getUsers);
router.get('/api/:id', userController.getUserById);
router.post('/api', checkPermiso('GESTIONAR USUARIOS'), userController.createUser);
router.put('/api/:id', checkPermiso('GESTIONAR USUARIOS'), userController.updateUser);
router.delete('/api/:id', checkPermiso('GESTIONAR USUARIOS'), userController.deleteUser);

// ========== RUTAS DE VISTA (HTML) ==========
router.get('/', userController.showUsersList); // Lista de usuarios
router.get('/new', userController.showCreateForm); // Formulario de creación
router.get('/:id', userController.showDetails); // Ver detalles de un usuario
router.get('/:id/edit', checkPermiso('GESTIONAR USUARIOS'), userController.showEditForm); // Formulario de edición

// ========== RUTAS DE ACCIÓN (POST) ==========
router.post('/', userController.handleCreate); // Procesar creación
router.post('/:id/edit', checkPermiso('GESTIONAR USUARIOS'), userController.handleUpdate); // Procesar edición
router.post('/:id/delete', checkPermiso('GESTIONAR USUARIOS'), userController.handleDelete); // Eliminar usuario

module.exports = router;
