// Password utilities
const bcrypt = require('bcrypt');

const passwordUtil = {
  async hashPassword(plainPassword) {
    const saltRounds = 12;
    return await bcrypt.hash(plainPassword, saltRounds);
  },

  async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
};

module.exports = passwordUtil;
