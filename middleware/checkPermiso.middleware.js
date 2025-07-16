const jwt = require('jsonwebtoken');
const UserService = require("../services/user.service");
const PermisoService = require("../services/permiso.service");

// Configuración JWT
const JWT_SECRET = process.env.JWT_SECRET || 'morganafreelog-super-secret-key-2025';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Generar JWT token
 * @param {Object} user - Datos del usuario
 * @returns {string} JWT token
 */
const generateToken = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    rol_id: user.rol_id,
    iat: Math.floor(Date.now() / 1000),
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'MorganFreelog',
    subject: user.id.toString()
  });
};

/**
 * Verificar JWT token
 * @param {string} token - JWT token
 * @returns {Object} Payload decodificado
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expirado');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Token inválido');
    } else {
      throw new Error('Error al verificar token');
    }
  }
};

/**
 * Extraer token del request
 * @param {Object} req - Request object
 * @returns {string|null} Token o null si no existe
 */
const extractToken = (req) => {
  // 1. Buscar token en header Authorization (Bearer token)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // 2. Buscar token en cookies (para requests web)
  if (req.cookies && req.cookies.authToken) {
    return req.cookies.authToken;
  }

  // 3. Buscar token en session (fallback para compatibilidad)
  if (req.session && req.session.authToken) {
    return req.session.authToken;
  }

  return null;
};

/**
 * Middleware para verificar si un usuario tiene un permiso específico
 * @param {string} permisoRequerido - Nombre del permiso requerido
 */
const checkPermiso = (permisoRequerido) => {
  return async (req, res, next) => {
    try {
      const token = extractToken(req);
      let userId = null;
      let user = null;

      console.log(`Verificando permiso: ${permisoRequerido}`);

      // Priorizar JWT si está presente
      if (token) {
        try {
          const decoded = verifyToken(token);
          userId = decoded.userId;
          user = {
            id: decoded.userId,
            email: decoded.email,
            name: decoded.name,
            rol_id: decoded.rol_id
          };
          console.log(`Usuario autenticado via JWT: ${user.email} (ID: ${userId})`);
        } catch (jwtError) {
          console.log('JWT inválido, intentando con sesión:', jwtError.message);
          // Si JWT falla, intentar con sesión tradicional
          userId = req.session?.userId || req.session?.user?.id;
        }
      } else {
        // Fallback a sesión tradicional si no hay JWT
        userId = req.session?.userId || req.session?.user?.id;
        console.log(`Usuario autenticado via sesión: ID ${userId}`);
      }

      if (!userId) {
        if (req.xhr || req.headers.accept?.includes("application/json")) {
          return res.status(401).json({
            error: "Debe iniciar sesión para acceder a esta funcionalidad",
          });
        } else {
          return res.render("error", {
            message: "Acceso denegado",
            error: "Debe iniciar sesión para acceder a esta funcionalidad",
          });
        }
      }

      // Si no tenemos datos del usuario del JWT, obtenerlos de la BD
      if (!user) {
        user = await UserService.getUserById(userId);
        if (!user) {
          if (req.xhr || req.headers.accept?.includes("application/json")) {
            return res.status(401).json({
              error: "Usuario no encontrado",
            });
          } else {
            return res.render("error", {
              message: "Acceso denegado",
              error: "Usuario no encontrado",
            });
          }
        }
      }

      const permisos = await PermisoService.getByRolId(user.rol_id);

      const tienePermiso = permisos.some((p) => p.nombre === permisoRequerido);

      if (!tienePermiso) {
        if (req.xhr || req.headers.accept?.includes("application/json")) {
          return res.status(403).json({
            error: "No tiene permisos para realizar esta acción",
          });
        } else {
          return res.render("error", {
            message: "Acceso denegado",
            error: "No tiene permisos para realizar esta acción",
          });
        }
      }

      // Agregar datos del usuario al request para uso posterior
      req.user = user;
      req.userPermissions = permisos;

      next();
    } catch (error) {
      console.error("Error en middleware checkPermiso:", error);

      if (req.xhr || req.headers.accept?.includes("application/json")) {
        return res.status(500).json({
          error: "Error al verificar permisos",
        });
      } else {
        return res.render("error", {
          message: "Error al verificar permisos",
          error: error.message,
        });
      }
    }
  };
};

module.exports = {
  checkPermiso,
  generateToken,
  verifyToken,
  extractToken
};
