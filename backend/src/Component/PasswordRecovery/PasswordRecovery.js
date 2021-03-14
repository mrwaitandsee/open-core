import BaseComponent from '../BaseComponent';
import Configuration from '../../Configuration';
import CryptoController from '../../Service/CryptoController';
import Transaction from '../../Core/Transaction';
import ChangePasswordByUserId from '../../Service/ChangePasswordByUserId';

const method = 'POST';
const action = 'demilitarized-zone/password-recovery';
export class PasswordRecovery extends BaseComponent {
  constructor(router) {
    super(router, method, action);
    super.initialization(this.handler);
  }

  async handler(request, response, next) {
    const { uuid, password } = request.body;
    
    const cryptoController = new CryptoController();
    const transactionId = cryptoController.random();
    const client = await Transaction.getClient(Configuration.getDatabaseUri());
    const passwordRecovery = new Transaction(Configuration.getDatabaseName(), 'passwordRecovery');
    await passwordRecovery.enableTransaction(client, transactionId);
    const passwordRecoveryData = await passwordRecovery.read(client, transactionId, {
      uuid,
    }, 0, 1);
    if (!passwordRecoveryData.length) {
      super.res(response, 404, false, 'Cannot recover password.');
      return;
    }
    const { userId } = passwordRecoveryData[0];

    const changePasswordByUserId = new ChangePasswordByUserId(client, transactionId, userId, password);
    await changePasswordByUserId.change();
    await passwordRecovery.delete(client, transactionId, {
      uuid,
    });
    await passwordRecovery.disableTransaction(client, transactionId);
    super.res(response, 200, true, 'Password recovered.');
  }
}
