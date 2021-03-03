import BaseComponent from '../BaseComponent';
import CheckUsernameExistence from '../../Service/CheckUsernameExistence';

const method = 'POST';
const action = 'demilitarized-zone/validate-username';
export class ValidateUsername extends BaseComponent {
  constructor(router) {
    super(router, method, action);
    super.initialization(this.handler);
  }

  async handler(request, response, next) {
    const { username } = request.body;

    const checkUsernameExistence = new CheckUsernameExistence(username);
    const isExistUsername = await checkUsernameExistence.check();

    if (!isExistUsername) {
      super.res(response, 200, true, 'This username is free.');
    } else {
      super.res(response, 409, false, 'This username is taken.');
    }
  }
}
