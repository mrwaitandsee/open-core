
export default class BaseComponent {
  constructor(router, method, action) {
    this.router = router;
    this.method = method;
    this.action = action;
  }

  initialization(handler) {
    this.router[this.method.toLowerCase()](
      `/${this.action}`,
      (request, response, next) => {
        handler(request, response, next)
      }
    );
    console.log('Route created:', this.method.toUpperCase(), `/api/${this.action}`);
  }

  async handler(request, response, next) {
    throw new Error('Not implemented exception.')
  }

  res(response, status, success, message) {
    response.status(status).send({
      success,
      message,
    });
  }
}
