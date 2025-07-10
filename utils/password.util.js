const bcrypt = require('bcrypt');

const passwordUtil = {
  /**
   * Hashea una contraseña usando bcrypt
   * @param {string} plainPassword - Contraseña en texto plano
   * @returns {Promise<string>} - Contraseña hasheada
   */
  async hashPassword(plainPassword) {
    const saltRounds = 12; // Número de rondas de salt (más rondas = más seguro pero más lento)
    return await bcrypt.hash(plainPassword, saltRounds);
  },

  /**
   * Verifica si una contraseña coincide con su hash
   * @param {string} plainPassword - Contraseña en texto plano
   * @param {string} hashedPassword - Contraseña hasheada
   * @returns {Promise<boolean>} - true si coinciden, false si no
   */
  async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
};

module.exports = passwordUtil;
