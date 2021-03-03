import BaseComponent from '../BaseComponent';
import CheckEmailExistence from '../../Service/CheckEmailExistence';
import CheckUsernameExistence from '../../Service/CheckUsernameExistence';
import ValidateEmail from '../../Service/ValidateEmail';
import CreateUser from '../../Service/CreateUser';

const method = 'POST';
const action = 'demilitarized-zone/registration';
export class Registration extends BaseComponent {
  constructor(router) {
    super(router, method, action);
    super.initialization(this.handler);
  }

  async handler(request, response, next) {
    const { username, email } = request.body;

    const validateEmail = new ValidateEmail(email);
    const isValidEmail = validateEmail.validate();
    const checkEmailExistence = new CheckEmailExistence(email);
    const isExistEmail = await checkEmailExistence.check();
    const checkUsernameExistence = new CheckUsernameExistence(username);
    const isExistUsername = await checkUsernameExistence.check();

    if (!isExistEmail && !isExistUsername && isValidEmail) {
      const createUser = new CreateUser(username, email);
      const success = await createUser.create();
      if (success) {
        super.res(response, 200, true, 'User registered successfully.');
      } else {
        super.res(response, 500, false, 'Cannot create user. Something went wrong.');
      }
    } else {
      super.res(response, 409, false, 'Cannot perform operation on current data.');
    }
  }
}
