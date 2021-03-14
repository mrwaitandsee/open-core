import BaseComponent from '../BaseComponent';
import Configuration from '../../Configuration';
import CryptoController from '../../Service/CryptoController';
import Transaction from '../../Core/Transaction';
import ChangePasswordByUserId from '../../Service/ChangePasswordByUserId';

const method = 'POST';
const action = 'militarized-zone/change-password';
export class ChangePassword extends BaseComponent {
  constructor(router) {
    super(router, method, action);
    super.initialization(this.handler);
  }

  async handler(request, response, next) {
    const { user, password } = request.body;
    const userId = Transaction.strToId(user);
    const cryptoController = new CryptoController();
    const transactionId = cryptoController.random();
    const client = await Transaction.getClient(Configuration.getDatabaseUri());
    const onOffTransaction = new Transaction(Configuration.getDatabaseName());
    await onOffTransaction.enableTransaction(client, transactionId);
    const changePasswordByUserIdController = new ChangePasswordByUserId(client, transactionId, userId, password);
    await changePasswordByUserIdController.change();
    const token = await changePasswordByUserIdController.getNewJwt();
    await onOffTransaction.disableTransaction(client, transactionId);
    super.res(response, 200, true, {
      message: 'Password recovered.',
      accessToken: token,
    });
  }
}
