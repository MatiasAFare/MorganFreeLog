# Estructura de Controladores y Rutas - MorganFreeLog

### 🎯 Patrón de Controladores

Cada controlador se organiza en **3 secciones claramente definidas**:

#### 1. **API METHODS (JSON)** 
- Métodos que responden con JSON para APIs REST
- Nombres: `getX`, `getXById`, `createX`, `updateX`, `deleteX`
- Uso: Integración con frontend JS, APIs externas, etc.

#### 2. **SHOW METHODS (Views)**
- Métodos que renderizan vistas EJS
- Nombres: `showXList`, `showCreateForm`, `showEditForm`, `showDetails`
- Uso: Navegación web tradicional, formularios HTML

#### 3. **HANDLE METHODS (Actions)**
- Métodos que procesan acciones y redirigen
- Nombres: `handleCreate`, `handleUpdate`, `handleDelete`
- Uso: Procesamiento de formularios, acciones POST

---

## 📁 Estructura por Entidad

### Auth Controller ✅
```javascript
// SHOW METHODS
showLoginForm()     // GET /auth/login
showRegisterForm()  // GET /auth/register

// HANDLE METHODS  
handleLogin()       // POST /auth/login
handleRegister()    // POST /auth/register
handleLogout()      // POST /auth/logout
```

### User Controller ✅
```javascript
// API METHODS
getUsers()          // GET /usuarios/api
getUserById()       // GET /usuarios/api/:id
createUser()        // POST /usuarios/api
updateUser()        // PUT /usuarios/api/:id
deleteUser()        // DELETE /usuarios/api/:id

// SHOW METHODS
showUsersList()     // GET /usuarios
showCreateForm()    // GET /usuarios/new
showDetails()       // GET /usuarios/:id
showEditForm()      // GET /usuarios/:id/edit

// HANDLE METHODS
handleCreate()      // POST /usuarios
handleUpdate()      // POST /usuarios/:id/edit
handleDelete()      // POST /usuarios/:id/delete
```

### Roles Controller ✅
```javascript
// API METHODS
getRoles()          // GET /roles/api
getRolById()        // GET /roles/api/:id
createRol()         // POST /roles/api
updateRol()         // PUT /roles/api/:id
deleteRol()         // DELETE /roles/api/:id

// SHOW METHODS
showRolesList()     // GET /roles
showCreateForm()    // GET /roles/new
showDetails()       // GET /roles/:id
showEditForm()      // GET /roles/:id/edit

// HANDLE METHODS
handleCreate()      // POST /roles
handleUpdate()      // POST /roles/:id/edit
handleDelete()      // POST /roles/:id/delete
```

### Permisos Controller ✅
```javascript
// API METHODS
getPermisos()       // GET /permisos/api
getPermisoById()    // GET /permisos/api/:id
createPermiso()     // POST /permisos/api
updatePermiso()     // PUT /permisos/api/:id
deletePermiso()     // DELETE /permisos/api/:id

// SHOW METHODS
showPermisosList()  // GET /permisos
showCreateForm()    // GET /permisos/new
showEditForm()      // GET /permisos/:id/edit

// HANDLE METHODS
handleCreate()      // POST /permisos
handleUpdate()      // POST /permisos/:id/edit
handleDelete()      // POST /permisos/:id/delete
```

---

## 🛣️ Estructura de Rutas

### Organización por Tipo

Cada archivo de rutas se organiza en **3 secciones**:

#### 1. **API ROUTES (JSON)**
```javascript
// ========== API ROUTES (JSON) ==========
router.get('/api', controller.getX);
router.get('/api/:id', controller.getXById);
router.post('/api', middleware, controller.createX);
router.put('/api/:id', middleware, controller.updateX);
router.delete('/api/:id', middleware, controller.deleteX);
```

#### 2. **VIEW ROUTES (HTML)**
```javascript
// ========== VIEW ROUTES (HTML) ==========
router.get('/', controller.showXList);           // Lista
router.get('/new', middleware, controller.showCreateForm);  // Formulario crear
router.get('/:id', controller.showDetails);      // Detalles
router.get('/:id/edit', middleware, controller.showEditForm); // Formulario editar
```

#### 3. **ACTION ROUTES (POST)**
```javascript
// ========== ACTION ROUTES (POST) ==========
router.post('/', middleware, controller.handleCreate);      // Procesar creación
router.post('/:id/edit', middleware, controller.handleUpdate);   // Procesar edición  
router.post('/:id/delete', middleware, controller.handleDelete); // Eliminar
```

---

## ✨ Beneficios de esta Estructura

### 🔍 **Claridad Mental**
- Cada método tiene un propósito específico y claro
- Fácil ubicar dónde está cada funcionalidad
- Separación clara entre vistas y lógica de negocio

### 🔧 **Mantenibilidad**
- Código organizado y predecible
- Fácil agregar nuevas funcionalidades
- Cada sección se puede modificar independientemente

### 🚀 **Escalabilidad**
- Patrón replicable para nuevas entidades
- API y vistas pueden evolucionar por separado
- Fácil testing de cada tipo de método

### 👥 **Trabajo en Equipo**
- Estructura consistente en todos los controladores
- Convenciones claras de nomenclatura
- Documentación implícita en la organización

---

## 🎨 Próximos Pasos Sugeridos

1. **Crear plantillas EJS faltantes** siguiendo la misma estructura
2. **Implementar validaciones** consistentes en todos los handle methods
3. **Agregar middleware** de autenticación donde sea necesario
4. **Documentar APIs** con herramientas como Swagger
5. **Testing** por separado de cada tipo de método

---

¡Tu estructura ahora es consistente, mantenible y escalable! 🎉
