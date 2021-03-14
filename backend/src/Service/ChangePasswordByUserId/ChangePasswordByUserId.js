import GetEmailPasswordSecretByUserId from '../GetEmailPasswordSecretByUserId';
import Configuration from '../../Configuration';
import Transaction from '../../Core/Transaction';
import HashController from '../HashController';
import MailerController from '../MailerController';
import jwt from 'jsonwebtoken';

export default class ChangePasswordByUserId {
  constructor(client, transactionId, userId, newPassword) {
    this.client = client;
    this.transactionId = transactionId;
    this.userId = userId;
    this.password = newPassword;
  }

  async change() {
    const getEmailPasswordSecretByUserId = new GetEmailPasswordSecretByUserId(this.userId, this.client, this.transactionId);
    const emailPasswordSecret = await getEmailPasswordSecretByUserId.getFirstEmailPasswordSecret();
    const emailPasswordSecretTransaction = new Transaction(
      Configuration.getDatabaseName(),
      'emailPasswordSecret',
    );
    const hashController = new HashController();
    const hash = await hashController.hash(this.password);
    await emailPasswordSecretTransaction.update(this.client, this.transactionId, {
      _id: emailPasswordSecret._id,
    }, {
      password: hash,
    })
    const mailer = new MailerController(
      Configuration.getMailerService(),
      Configuration.getMailerHost(),
      Configuration.getMailerAuthUser(),
      Configuration.getMailerAuthPass(),
    );
    mailer.send(Configuration.getMailerAuthUser(), emailPasswordSecret.email, 'OpenCore Password has been changed.',
      'Your password has been changed, if it is not you, restore your password on the site.',
    );
  }

  async getNewJwt() {
    const getEmailPasswordSecretByUserId = new GetEmailPasswordSecretByUserId(this.userId, this.client, this.transactionId);
    const emailPasswordSecret = await getEmailPasswordSecretByUserId.getFirstEmailPasswordSecret();
    return jwt.sign({
      user: this.userId,
      hash: emailPasswordSecret.password,
    }, Configuration.getJwtSecret());
  }
}
