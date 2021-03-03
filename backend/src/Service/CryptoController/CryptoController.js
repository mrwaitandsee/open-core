import cryptojs from 'crypto-js';

export default class CryptoController {
  constructor(key = 'STRONG_KEY') {
    this.key = key;
  }

  encrypt(str) {
    return cryptojs.AES.encrypt(str, this.key).toString();
  }

  decrypt(str) {
    const bytes = cryptojs.AES.decrypt(str, this.key);
    return bytes.toString(cryptojs.enc.Utf8);
  }

  random(length = 256) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}

