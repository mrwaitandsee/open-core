import BaseComponent from '../BaseComponent';

const method = 'POST';
const action = 'militarized-zone/me';
export class Me extends BaseComponent {
  constructor(router) {
    super(router, method, action);
    super.initialization(this.handler);
  }

  async handler(request, response, next) {
    const { user } = request.user;
    super.res(response, 200, true, {
      message: 'ID received.',
      userId: user,
    });
  }
}
