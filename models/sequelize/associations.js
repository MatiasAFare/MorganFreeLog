const User = require('./user.model');
const Rol = require('./rol.model');
const Permiso = require('./permiso.model');
const Item = require('./item.model');
const Cart = require('./cart.model');
const Log = require('./log.model');

// Definir relaciones entre modelos
const setupAssociations = () => {
  // Relación User -> Rol (muchos a uno)
  User.belongsTo(Rol, { foreignKey: 'rol_id', as: 'rol' });
  Rol.hasMany(User, { foreignKey: 'rol_id', as: 'usuarios' });

  // Relación Rol -> Permiso (muchos a muchos)
  Rol.belongsToMany(Permiso, { 
    through: 'rol_permiso', 
    foreignKey: 'rol_id', 
    otherKey: 'permiso_id',
    as: 'permisos'
  });
  
  Permiso.belongsToMany(Rol, { 
    through: 'rol_permiso', 
    foreignKey: 'permiso_id', 
    otherKey: 'rol_id',
    as: 'roles'
  });

  // Relación Cart -> User (muchos a uno)
  Cart.belongsTo(User, { foreignKey: 'user_id', as: 'usuario' });
  User.hasMany(Cart, { foreignKey: 'user_id', as: 'carrito' });

  // Relación Cart -> Item (muchos a uno)
  Cart.belongsTo(Item, { foreignKey: 'item_id', as: 'item' });
  Item.hasMany(Cart, { foreignKey: 'item_id', as: 'enCarritos' });

  // Relación Log -> User (muchos a uno)
  Log.belongsTo(User, { foreignKey: 'user_id', as: 'User' });
  User.hasMany(Log, { foreignKey: 'user_id', as: 'logs' });
};

module.exports = { setupAssociations };
