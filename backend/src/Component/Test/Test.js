import BaseComponent from '../BaseComponent';

const method = 'POST';
const action = 'militarized-zone/test';
export class Test extends BaseComponent {
  constructor(router) {
    super(router, method, action);
    super.initialization(this.handler);
  }

  async handler(request, response, next) {
    super.res(response, 200, true, request.user);
  }
}
