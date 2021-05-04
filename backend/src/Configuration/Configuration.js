
export default class Configuration {
  static getPortOfApp() {
    return process.env.PORT || 6000;
  }

  static getApiUri() {
    return process.env.API_URI || 'http://localhost:4000/';
  }

  static getDatabaseUri() {
    return process.env.DB_URI || 'mongodb://localhost:27017/';
  }

  static getDatabaseName() {
    return process.env.DB_NAME || 'OPEN_CORE';
  }

  static getMailerService() {
    return process.env.MAILER_SERVICE;
  }

  static getMailerHost() {
    return process.env.MAILER_HOST;
  }

  static getMailerAuthUser() {
    return process.env.MAILER_AUTH_USER;
  }

  static getMailerAuthPass() {
    return process.env.MAILER_AUTH_PASS;
  }

  static getJwtSecret() {
    return process.env.JWT_SECRET;
  }
}
