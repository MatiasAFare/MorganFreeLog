const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/roles.controller');
const checkPermiso = require('../middleware/checkPermiso.middleware');

router.get('/api', rolesController.getRoles);
router.get('/api/:id', rolesController.getRolById);
router.post('/api', checkPermiso('gestionar_roles'), rolesController.createRol);
router.put('/api/:id', checkPermiso('gestionar_roles'), rolesController.updateRol);
router.delete('/api/:id', checkPermiso('gestionar_roles'), rolesController.deleteRol);

router.get('/', rolesController.showRolesList);
router.get('/new', checkPermiso('gestionar_roles'), rolesController.showCreateForm);
router.post('/', checkPermiso('gestionar_roles'), rolesController.handleCreate);
router.get('/:id', rolesController.showDetails);
router.get('/:id/edit', checkPermiso('gestionar_roles'), rolesController.showEditForm);
router.post('/:id/edit', checkPermiso('gestionar_roles'), rolesController.handleUpdate);
router.post('/:id/delete', checkPermiso('gestionar_roles'), rolesController.handleDelete);

module.exports = router;