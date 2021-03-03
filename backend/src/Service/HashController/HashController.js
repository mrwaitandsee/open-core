import bcrypt from 'bcryptjs';

export default class HashController {
  constructor(salt = 8) {
    this.salt = salt;
  }

  async hash(str) {
    return bcrypt.hash(str, this.salt);
  }

  async compare(str, hash) {
    return bcrypt.compare(str, hash);
  }
}
