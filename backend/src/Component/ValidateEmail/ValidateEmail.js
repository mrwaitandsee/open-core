import BaseComponent from '../BaseComponent';
import CheckEmailExistence from '../../Service/CheckEmailExistence';
import ValidateEmailService from '../../Service/ValidateEmail';

const method = 'POST';
const action = 'demilitarized-zone/validate-email';
export class ValidateEmail extends BaseComponent {
  constructor(router) {
    super(router, method, action);
    super.initialization(this.handler);
  }

  async handler(request, response, next) {
    const { email } = request.body;

    const validateEmail = new ValidateEmailService(email);
    const isValidEmail = validateEmail.validate();
    const checkEmailExistence = new CheckEmailExistence(email);
    const isExistEmail = await checkEmailExistence.check();

    if (!isExistEmail && isValidEmail) {
      super.res(response, 200, true, 'You can use this email.');
    } else {
      if (isExistEmail) {
        super.res(response, 409, false, 'This email is already taken.');
      }
      else if (!isValidEmail) {
        super.res(response, 409, false, 'Invalid email.');
      }
    }
  }
}
