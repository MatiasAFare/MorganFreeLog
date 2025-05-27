const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/roles.controller');
const checkPermiso = require('../middleware/checkPermiso.middleware');

// ========== API ROUTES (JSON) ==========
router.get('/api', rolesController.getRoles);
router.get('/api/:id', rolesController.getRolById);
router.post('/api', checkPermiso('gestionar_roles'), rolesController.createRol);
router.put('/api/:id', checkPermiso('gestionar_roles'), rolesController.updateRol);
router.delete('/api/:id', checkPermiso('gestionar_roles'), rolesController.deleteRol);

// ========== VIEW ROUTES (HTML) ==========
router.get('/', rolesController.showRolesList); // Lista de roles
router.get('/new', checkPermiso('gestionar_roles'), rolesController.showCreateForm); // Formulario de creación
router.get('/:id', rolesController.showDetails); // Ver detalles de un rol
router.get('/:id/edit', checkPermiso('gestionar_roles'), rolesController.showEditForm); // Formulario de edición

// ========== ACTION ROUTES (POST) ==========
router.post('/', checkPermiso('gestionar_roles'), rolesController.handleCreate); // Procesar creación
router.post('/:id/edit', checkPermiso('gestionar_roles'), rolesController.handleUpdate); // Procesar edición
router.post('/:id/delete', checkPermiso('gestionar_roles'), rolesController.handleDelete); // Eliminar rol

module.exports = router;