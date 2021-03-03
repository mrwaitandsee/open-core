import CryptoController from '../CryptoController';
import Configuration from '../../Configuration';
import Transaction from '../../Core/Transaction';

export default class CheckUsernameExistence {
  constructor(username) {
    this.username = username;
    const cryptoController = new CryptoController();
    this.transactionId = cryptoController.random();
  }

  async check() {
    const transaction = new Transaction(
      Configuration.getDatabaseName(),
      'users',
    );

    const client = await Transaction.getClient(Configuration.getDatabaseUri());
    await transaction.enableTransaction(client, this.transactionId);
    const docs = await transaction.read(
      client,
      this.transactionId,
      {
        username: this.username,
      },
      0,
      1,
    );
    await transaction.disableTransaction(client, this.transactionId);
    Transaction.disposeClient(client);
    return docs.length > 0;
  }
}
