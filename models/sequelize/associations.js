// Database associations
const User = require('./user.model');
const Rol = require('./rol.model');
const Permiso = require('./permiso.model');
const Item = require('./item.model');
const Cart = require('./cart.model');
const Log = require('./log.model');

const setupAssociations = () => {
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
  Cart.belongsTo(User, { foreignKey: 'user_id', as: 'usuario', onDelete: 'CASCADE' });
  User.hasMany(Cart, { foreignKey: 'user_id', as: 'carrito', onDelete: 'CASCADE' });

  // Relación Cart -> Item (muchos a uno)
  Cart.belongsTo(Item, { foreignKey: 'item_id', as: 'item', onDelete: 'CASCADE' });
  Item.hasMany(Cart, { foreignKey: 'item_id', as: 'enCarritos', onDelete: 'CASCADE' });

  // Relación Log -> User (muchos a uno)
  Log.belongsTo(User, { foreignKey: 'user_id', as: 'User', onDelete: 'CASCADE' });
  User.hasMany(Log, { foreignKey: 'user_id', as: 'logs', onDelete: 'CASCADE' });
};

module.exports = { setupAssociations };
