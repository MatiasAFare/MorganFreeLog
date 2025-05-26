const UserService = require('../services/user.service');
const PermisoService = require('../services/permiso.service');

/**
 * Middleware para verificar si un usuario tiene un permiso específico
 * @param {string} permisoRequerido - Nombre del permiso requerido
 */
const checkPermiso = (permisoRequerido) => {
    return async (req, res, next) => {
        try {
            const userId = req.session?.userId;

            if (!userId) {
                if (req.xhr || req.headers.accept?.includes('application/json')) {
                    return res.status(401).json({
                        error: 'Debe iniciar sesión para acceder a esta funcionalidad'
                    });
                } else {
                    return res.render('error', {
                        message: 'Acceso denegado',
                        error: 'Debe iniciar sesión para acceder a esta funcionalidad'
                    });
                }
            }

            const user = await UserService.getById(userId);

            if (!user) {
                if (req.xhr || req.headers.accept?.includes('application/json')) {
                    return res.status(401).json({
                        error: 'Usuario no encontrado'
                    });
                } else {
                    return res.render('error', {
                        message: 'Acceso denegado',
                        error: 'Usuario no encontrado'
                    });
                }
            }

            const permisos = await PermisoService.getByRolId(user.rol_id);

            const tienePermiso = permisos.some(p => p.nombre === permisoRequerido);

            if (!tienePermiso) {
                if (req.xhr || req.headers.accept?.includes('application/json')) {
                    return res.status(403).json({
                        error: 'No tiene permisos para realizar esta acción'
                    });
                } else {
                    return res.render('error', {
                        message: 'Acceso denegado',
                        error: 'No tiene permisos para realizar esta acción'
                    });
                }
            }

            next();
        } catch (error) {
            console.error('Error en middleware checkPermiso:', error);

            if (req.xhr || req.headers.accept?.includes('application/json')) {
                return res.status(500).json({
                    error: 'Error al verificar permisos'
                });
            } else {
                return res.render('error', {
                    message: 'Error al verificar permisos',
                    error: error.message
                });
            }
        }
    };
};

module.exports = checkPermiso;