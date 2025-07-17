# MorganFreeLog 🚀

<div align="center">
  <img src="public/morganshop.png" alt="MorganShop Logo" width="3000" height="400" style="border-radius: 15px; margin: 20px 0;">
</div>

Sistema de gestión de usuarios, tienda, carrito de compras, roles y permisos con logging automático usando Morgan y Sequelize.

## Arquitectura

```
Browser ↔ Routers ↔ Controllers ↔ Services ↔ Models
                ↓                      ↓          ↓
           Middleware              Lógica    Gestión DB
             (JWT)               Negocio   
                ↓
            Rutas API → RESTful
                ↓
          Rutas Vista → HTML
                ↓
         Rutas Acción → Forms
```

## Stack Tecnológico

- **Backend:** Node.js + Express
- **Database:** SQLite + Sequelize ORM
- **Auth:** Sessions + JWT
- **Logging:** Morgan + Custom Stream
- **Templates:** EJS
- **Security:** bcrypt + permissions

## Estructura del Proyecto

```
├── config/           # Configuraciones (DB, Morgan)
├── controllers/      # Lógica de rutas
├── middleware/       # Autenticación y permisos
├── models/           # Modelos Sequelize
├── routes/           # Rutas API, Vista y Acciones
├── services/         # Lógica de negocio
├── seeders/          # Datos iniciales
├── utils/            # Utilidades (password)
├── views/            # Templates EJS
└── public/           # Archivos estáticos
```

## Características

- ✅ Sistema de roles y permisos
- ✅ Autenticación con sesiones
- ✅ Logging automático en BD
- ✅ Shop con carrito de compras
- ✅ Panel de administración
- ✅ Gestión de usuarios completa
- ✅ Seeders para datos iniciales
- ✅ Carrito con persistencia
- ✅ Sistema de compras

## Instalación

```bash
npm install
npm start
```

### Seeders
El sistema incluye datos iniciales que se crean automáticamente:
- Roles: Administrador y Usuario
- Permisos: LOGIN, GESTIONAR USUARIOS, GESTIONAR ROLES, etc.
- Usuarios por defecto
- Items de ejemplo para la tienda

## Usuarios por Defecto

- **Admin:** `admin@admin.com` / `admin123`
- **User:** `user@user.com` / `user123`

## Rutas del Sistema

### Rutas de API (JSON)
- `GET /api/usuarios` - Lista de usuarios
- `GET /api/roles` - Lista de roles
- `GET /api/cart` - Items del carrito
- `DELETE /api/cart/:id` - Eliminar item
- `POST /api/cart/purchase` - Procesar compra
- `GET /api/shop` - Items de la tienda

### Rutas de Vista (HTML)
- `GET /` - Página principal
- `GET /auth/login` - Formulario de login
- `GET /usuarios` - Lista de usuarios
- `GET /roles` - Lista de roles
- `GET /shop` - Tienda
- `GET /cart` - Carrito
- `GET /logs` - Logs del sistema

### Rutas de Acción (Forms)
- `POST /auth/login` - Procesar login
- `POST /usuarios` - Crear usuario
- `POST /usuarios/:id/edit` - Actualizar usuario
- `POST /usuarios/:id/delete` - Eliminar usuario
- `POST /cart` - Agregar al carrito
- `POST /cart/:id/delete` - Eliminar del carrito
- `POST /shop` - Crear item

---

**Proyecto:** MorganFreeLog  
**Autor:** MatiasAFare  
**Versión:** 1.0.0
