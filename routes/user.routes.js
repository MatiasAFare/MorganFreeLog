const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const checkPermiso = require('../middleware/checkPermiso.middleware');

// ========== API ROUTES (JSON) ==========
router.get('/api', userController.getUsers);
router.get('/api/:id', userController.getUserById);
router.post('/api', checkPermiso('gestionar_usuarios'), userController.createUser);
router.put('/api/:id', checkPermiso('gestionar_usuarios'), userController.updateUser);
router.delete('/api/:id', checkPermiso('gestionar_usuarios'), userController.deleteUser);

// ========== VIEW ROUTES (HTML) ==========
router.get('/', userController.showUsersList); // Lista de usuarios
router.get('/new', userController.showCreateForm); // Formulario de creación
router.get('/:id', userController.showDetails); // Ver detalles de un usuario
router.get('/:id/edit', checkPermiso('gestionar_usuarios'), userController.showEditForm); // Formulario de edición

// ========== ACTION ROUTES (POST) ==========
router.post('/', userController.handleCreate); // Procesar creación
router.post('/:id/edit', checkPermiso('gestionar_usuarios'), userController.handleUpdate); // Procesar edición
router.post('/:id/delete', checkPermiso('gestionar_usuarios'), userController.handleDelete); // Eliminar usuario

module.exports = router;
