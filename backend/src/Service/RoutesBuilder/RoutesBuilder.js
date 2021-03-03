import express from 'express';

export default class RoutesBuilder {
  constructor(app, components) {
    this.router = express.Router();

    for (const value of Object.values(components)) {
      new value(this.router);
    }

    app.use('/api', this.router);
  }

  getRouter() {
    return this.router;
  }
}
