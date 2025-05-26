const PermisoService = require('../services/permiso.service');


const permisosController = {

    getPermisos: async (req, res) => {
        try {
            const permisos = await PermisoService.getAll();
            res.status(200).json(permisos);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching permisos', error: error.message });
        }
    },

    getPermisoById: async (req, res) => {
        try {
            const permiso = await PermisoService.getById(req.params.id);
            if (!permiso) {
                return res.status(404).json({ message: 'Permiso no encontrado' });
            }
            res.status(200).json(permiso);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching permiso', error: error.message });
        }
    },

    createPermiso: async (req, res) => {
        try {
            const { nombre, descripcion } = req.body;
            if (!nombre) {
                return res.status(400).json({ message: 'El nombre es requerido' });
            }

            const permiso = await PermisoService.create(nombre, descripcion);
            res.status(201).json(permiso);
        } catch (error) {
            if (error.message.includes('Ya existe un permiso')) {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: 'Error creating permiso', error: error.message });
        }
    },

    updatePermiso: async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre, descripcion } = req.body;

            if (!nombre) {
                return res.status(400).json({ message: 'El nombre es requerido' });
            }

            const result = await PermisoService.update(id, nombre, descripcion);
            if (result.changes === 0) {
                return res.status(404).json({ message: 'Permiso no encontrado' });
            }

            res.status(200).json(result);
        } catch (error) {
            if (error.message.includes('Ya existe un permiso')) {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: 'Error updating permiso', error: error.message });
        }
    },

    deletePermiso: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await PermisoService.delete(id);

            if (result.changes === 0) {
                return res.status(404).json({ message: 'Permiso no encontrado' });
            }

            res.status(200).json({ message: 'Permiso eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting permiso', error: error.message });
        }
    },

    showPermisosList: async (req, res) => {
        try {
            const permisos = await PermisoService.getAll();
            res.render('permisos/index', {
                permisos,
                error: req.query.error
            });
        } catch (error) {
            res.render('error', {
                message: 'Error al cargar permisos',
                error: error.message
            });
        }
    },

    showCreateForm: async (req, res) => {
        res.render('permisos/new', { error: null });
    },

    handleCreate: async (req, res) => {
        try {
            const { nombre, descripcion } = req.body;
            if (!nombre) {
                return res.render('permisos/new', {
                    error: 'El nombre es requerido',
                    permiso: { nombre, descripcion }
                });
            }

            await PermisoService.create(nombre, descripcion);
            res.redirect('/permisos');
        } catch (error) {
            res.render('permisos/new', {
                error: error.message,
                permiso: req.body
            });
        }
    },

    showEditForm: async (req, res) => {
        try {
            const { id } = req.params;
            const permiso = await PermisoService.getById(id);

            if (!permiso) {
                return res.render('error', { message: 'Permiso no encontrado' });
            }

            res.render('permisos/edit', { permiso, error: null });
        } catch (error) {
            res.render('error', {
                message: 'Error al cargar el permiso',
                error: error.message
            });
        }
    },

    handleUpdate: async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre, descripcion } = req.body;

            if (!nombre) {
                const permiso = await PermisoService.getById(id);
                return res.render('permisos/edit', {
                    error: 'El nombre es requerido',
                    permiso: { ...permiso, nombre, descripcion }
                });
            }

            const result = await PermisoService.update(id, nombre, descripcion);
            if (result.changes === 0) {
                return res.render('error', { message: 'Permiso no encontrado' });
            }

            res.redirect('/permisos');
        } catch (error) {
            const permiso = { id: req.params.id, ...req.body };
            res.render('permisos/edit', {
                error: error.message,
                permiso
            });
        }
    },

    handleDelete: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await PermisoService.delete(id);

            if (result.changes === 0) {
                return res.redirect('/permisos?error=Permiso no encontrado');
            }

            res.redirect('/permisos');
        } catch (error) {
            res.redirect(`/permisos?error=${encodeURIComponent(error.message)}`);
        }
    }
};

module.exports = permisosController;