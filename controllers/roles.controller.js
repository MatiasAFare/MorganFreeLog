const RolService = require('../services/rol.service');
const PermisoService = require('../services/permiso.service');

const rolesController = {
    // ========== API METHODS (JSON) ==========
    getRoles: async (req, res) => {
        try {
            const roles = await RolService.getAll();
            res.status(200).json(roles);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching roles', error: error.message });
        }
    },

    getRolById: async (req, res) => {
        try {
            const rol = await RolService.getById(req.params.id);
            if (!rol) {
                return res.status(404).json({ message: 'Rol no encontrado' });
            }

            const permisos = await PermisoService.getByRolId(rol.id);
            res.status(200).json({ ...rol, permisos });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching rol', error: error.message });
        }
    },

    createRol: async (req, res) => {
        try {
            const { nombre } = req.body;
            if (!nombre) {
                return res.status(400).json({ message: 'El nombre es requerido' });
            }

            const rol = await RolService.create(nombre);
            res.status(201).json(rol);
        } catch (error) {
            if (error.message.includes('Ya existe un rol')) {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: 'Error creating rol', error: error.message });
        }
    },

    updateRol: async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre, permisos } = req.body;

            if (!nombre) {
                return res.status(400).json({ message: 'El nombre es requerido' });
            }

            const result = await RolService.update(id, nombre);
            if (result.changes === 0) {
                return res.status(404).json({ message: 'Rol no encontrado' });
            }

            if (permisos) {
                await PermisoService.updateRolPermisos(id, permisos);
            }

            res.status(200).json(result);
        } catch (error) {
            if (error.message.includes('Ya existe un rol')) {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: 'Error updating rol', error: error.message });
        }
    },

    deleteRol: async (req, res) => {
        try {
            const { id } = req.params;

            const usuarios = await RolService.getUsersByRolId(id);
            if (usuarios.length > 0) {
                return res.status(400).json({
                    message: 'No se puede eliminar el rol porque hay usuarios asignados a él'
                });
            }

            const result = await RolService.delete(id);
            if (result.changes === 0) {
                return res.status(404).json({ message: 'Rol no encontrado' });
            }

            res.status(200).json({ message: 'Rol eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting rol', error: error.message });
        }
    },

    // ========== SHOW METHODS (Views) ==========
    showRolesList: async (req, res) => {
        try {
            const roles = await RolService.getAll();
            res.render('roles/index', {
                roles,
                error: req.query.error
            });
        } catch (error) {
            res.render('error', {
                message: 'Error al cargar roles',
                error: error.message
            });
        }
    },

    showCreateForm: async (req, res) => {
        res.render('roles/new', { error: null });
    },

    showEditForm: async (req, res) => {
        try {
            const { id } = req.params;
            const rol = await RolService.getById(id);

            if (!rol) {
                return res.render('error', { message: 'Rol no encontrado' });
            }

            const allPermisos = await PermisoService.getAll();
            const rolPermisos = await PermisoService.getByRolId(id);

            const rolPermisosMap = {};
            rolPermisos.forEach(permiso => {
                rolPermisosMap[permiso.id] = true;
            });

            res.render('roles/edit', {
                rol,
                allPermisos,
                rolPermisosMap,
                error: null
            });
        } catch (error) {
            res.render('error', {
                message: 'Error al cargar formulario de edición',
                error: error.message
            });
        }
    },

    showDetails: async (req, res) => {
        try {
            const { id } = req.params;
            const rol = await RolService.getById(id);

            if (!rol) {
                return res.render('error', { message: 'Rol no encontrado' });
            }

            const permisos = await PermisoService.getByRolId(id);
            const usuarios = await RolService.getUsersByRolId(id);

            res.render('roles/details', {
                rol,
                permisos,
                usuarios
            });
        } catch (error) {
            res.render('error', {
                message: 'Error al cargar detalles del rol',
                error: error.message
            });
        }
    },

    // ========== HANDLE METHODS (Actions) ==========
    handleCreate: async (req, res) => {
        try {
            const { nombre } = req.body;
            if (!nombre) {
                return res.render('roles/new', {
                    error: 'El nombre es requerido',
                    rol: { nombre }
                });
            }

            await RolService.create(nombre);
            res.redirect('/roles');
        } catch (error) {
            res.render('roles/new', {
                error: error.message,
                rol: req.body
            });
        }
    },

    handleUpdate: async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre, permisos } = req.body;

            if (!nombre) {
                const rol = await RolService.getById(id);
                const allPermisos = await PermisoService.getAll();
                const rolPermisos = await PermisoService.getByRolId(id);

                const rolPermisosMap = {};
                rolPermisos.forEach(permiso => {
                    rolPermisosMap[permiso.id] = true;
                });

                return res.render('roles/edit', {
                    error: 'El nombre es requerido',
                    rol: { ...rol, nombre },
                    allPermisos,
                    rolPermisosMap
                });
            }

            await RolService.update(id, nombre);
            await PermisoService.updateRolPermisos(id, permisos || []);

            res.redirect('/roles');
        } catch (error) {
            res.render('error', {
                message: 'Error al actualizar rol',
                error: error.message
            });
        }
    },

    handleDelete: async (req, res) => {
        try {
            const { id } = req.params;

            const usuarios = await RolService.getUsersByRolId(id);
            if (usuarios.length > 0) {
                return res.redirect('/roles?error=No se puede eliminar el rol porque hay usuarios asignados a él');
            }

            const result = await RolService.delete(id);
            if (result.changes === 0) {
                return res.redirect('/roles?error=Rol no encontrado');
            }

            res.redirect('/roles');
        } catch (error) {
            res.redirect(`/roles?error=${encodeURIComponent(error.message)}`);
        }
    }
};

module.exports = rolesController;