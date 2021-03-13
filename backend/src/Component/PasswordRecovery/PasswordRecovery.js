import BaseComponent from '../BaseComponent';
import Configuration from '../../Configuration';
import CryptoController from '../../Service/CryptoController';
import Transaction from '../../Core/Transaction';
import GetEmailPasswordSecretByUserId from '../../Service/GetEmailPasswordSecretByUserId';
import MailerController from '../../Service/MailerController';

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
    if (!passwordRecoveryData.length) super.res(response, 404, false, 'Cannot recover password.');
    const { userId } = passwordRecoveryData[0];
    const getterEmailPasswordSecretByUserId = new GetEmailPasswordSecretByUserId(userId, client, transactionId);
    const emailPasswordSecret = await getterEmailPasswordSecretByUserId.getFirstEmailPasswordSecret();
    const mailer = new MailerController(
      Configuration.getMailerService(),
      Configuration.getMailerHost(),
      Configuration.getMailerAuthUser(),
      Configuration.getMailerAuthPass(),
    );
    mailer.send(Configuration.getMailerAuthUser(), emailPasswordSecret.email, 'OpenCore Password has been changed.',
      'Your password has been changed, if it is not you, restore your password on the site.',
    );
    await passwordRecovery.disableTransaction(client, transactionId);
    super.res(response, 200, true, 'Password recovered.');
  }
}
