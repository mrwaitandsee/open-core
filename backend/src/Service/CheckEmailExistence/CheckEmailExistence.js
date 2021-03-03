import CryptoController from '../CryptoController';
import Configuration from '../../Configuration';
import Transaction from '../../Core/Transaction';

export default class CheckEmailExistence {
  constructor(email) {
    this.email = email;
    const cryptoController = new CryptoController();
    this.transactionId = cryptoController.random();
  }

  async check() {
    const client = await Transaction.getClient(Configuration.getDatabaseUri());
    const transaction = new Transaction(
      Configuration.getDatabaseName(),
      'emailPasswordSecret',
    );
    await transaction.enableTransaction(client, this.transactionId);
    const docs = await transaction.read(
      client,
      this.transactionId,
      {
        email: this.email,
      },
      0,
      1,
    );
    await transaction.disableTransaction(client, this.transactionId);
    Transaction.disposeClient(client);
    return docs.length > 0;
  }
}
