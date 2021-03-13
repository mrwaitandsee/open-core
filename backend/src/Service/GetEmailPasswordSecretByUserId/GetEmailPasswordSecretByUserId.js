import Configuration from '../../Configuration';
import Transaction from '../../Core/Transaction';

export default class GetEmailPasswordSecretByUserId {
  constructor(userId, client, transactionId) {
    this.userId = userId;
    this.client = client;
    this.transactionId = transactionId;
  }

  async getFirstEmailPasswordSecret() {
    const secrets = new Transaction(
      Configuration.getDatabaseName(),
      'secrets',
    );
    const emailPasswordSecret = new Transaction(
      Configuration.getDatabaseName(),
      'emailPasswordSecret',
    );

    const secretsData = await secrets.read(this.client, this.transactionId, {
      userId: this.userId,
    }, 0, 1);
    if (!secretsData.length) throw new Error('Secrets is empty. Incorrect user id.');
    const emailPasswordSecretData = await emailPasswordSecret.read(this.client, this.transactionId, {
      secretId: secretsData[0]._id,
    }, 0, 1);
    if (!emailPasswordSecretData.length) throw new Error('Oops... This is very bad bro... Incorrect user.');
    return emailPasswordSecretData[0];
  }
}
