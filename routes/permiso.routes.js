const express = require('express');
const router = express.Router();
const permisosController = require('../controllers/permiso.controller');
const checkPermiso = require('../middleware/checkPermiso.middleware');

router.get('/api', permisosController.getPermisos);
router.get('/api/:id', permisosController.getPermisoById);
router.post('/api', checkPermiso('gestionar_permisos'), permisosController.createPermiso);
router.put('/api/:id', checkPermiso('gestionar_permisos'), permisosController.updatePermiso);
router.delete('/api/:id', checkPermiso('gestionar_permisos'), permisosController.deletePermiso);

router.get('/', permisosController.showPermisosList);
router.get('/new', checkPermiso('gestionar_permisos'), permisosController.showCreateForm);
router.post('/', checkPermiso('gestionar_permisos'), permisosController.handleCreate);
router.get('/:id/edit', checkPermiso('gestionar_permisos'), permisosController.showEditForm);
router.post('/:id/edit', checkPermiso('gestionar_permisos'), permisosController.handleUpdate);
router.post('/:id/delete', checkPermiso('gestionar_permisos'), permisosController.handleDelete);

module.exports = router;