import BaseComponent from '../BaseComponent';
import CheckEmailExistence from '../../Service/CheckEmailExistence';
import Configuration from '../../Configuration';
import CryptoController from '../../Service/CryptoController';
import Transaction from '../../Core/Transaction';
import MailerController from '../../Service/MailerController';

const method = 'POST';
const action = 'demilitarized-zone/password-recovery-generate-url';
export class PasswordRecoveryGenerateUrl extends BaseComponent {
  constructor(router) {
    super(router, method, action);
    super.initialization(this.handler);
  }

  async handler(request, response, next) {
    const { email } = request.body;
    const checkEmailExistence = new CheckEmailExistence(email);
    const isExistEmail = await checkEmailExistence.check();
    if (!isExistEmail) {
      super.res(response, 404, false, 'No user with this email.');
    } else {
      const cryptoController = new CryptoController();
      const transactionId = cryptoController.random();
      const client = await Transaction.getClient(Configuration.getDatabaseUri());
      const emailPasswordSecrets = new Transaction(Configuration.getDatabaseName(), 'emailPasswordSecret');
      await emailPasswordSecrets.enableTransaction(client, transactionId);
      const emailPasswordSecretsData = await emailPasswordSecrets.read(client, transactionId, {
        email,
      }, 0, 1);
      if (!emailPasswordSecretsData.length) {
        await emailPasswordSecrets.disableTransaction(client, transactionId);
        return super.res(response, 404, false, 'No user with this email.');
      }
      const secrets = new Transaction(Configuration.getDatabaseName(), 'secrets');
      const secretsData = await secrets.read(client, transactionId, {
        _id: emailPasswordSecretsData[0].secretId,
      }, 0, 1);
      if (!secretsData.length) {
        await emailPasswordSecrets.disableTransaction(client, transactionId);
        return super.res(response, 404, false, 'No user with this email.');
      }
      const users = new Transaction(Configuration.getDatabaseName(), 'users');
      const usersData = await users.read(client, transactionId, {
        _id: secretsData[0].userId,
      }, 0, 1);
      if (!usersData.length) {
        await emailPasswordSecrets.disableTransaction(client, transactionId);
        return super.res(response, 404, false, 'No user with this email.');
      }
      const passwordRecovery = new Transaction(Configuration.getDatabaseName(), 'passwordRecovery');
      await passwordRecovery.delete(client, transactionId, {
        userId: usersData[0]._id,
      });
      const uuid = `${cryptoController.random(64)}${usersData[0]._id}`;
      await passwordRecovery.create(client, transactionId, [
        {
          userId: usersData[0]._id,
          uuid,
        },
      ]);
      const passwordRecoveryData = await passwordRecovery.read(client, transactionId, {
        userId: usersData[0]._id,
      }, 0, 1);
      if (!passwordRecoveryData.length) {
        await emailPasswordSecrets.disableTransaction(client, transactionId);
        return super.res(response, 404, false, 'No record of password recovery.');
      }
      const mailer = new MailerController(
        Configuration.getMailerService(),
        Configuration.getMailerHost(),
        Configuration.getMailerAuthUser(),
        Configuration.getMailerAuthPass(),
      );
      mailer.send(Configuration.getMailerAuthUser(), email, 'OpenCore Password recovery.',
        `Your link to reset your password.\n${Configuration.getApiUri()}password-recovery/${uuid}`,
      );
      await emailPasswordSecrets.disableTransaction(client, transactionId);
      super.res(response, 200, true, 'Recovery record generated.');
    }
  }
}
