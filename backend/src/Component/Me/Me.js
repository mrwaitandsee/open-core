import BaseComponent from '../BaseComponent';
import Configuration from '../../Configuration';
import Transaction from '../../Core/Transaction';
import CryptoController from '../../Service/CryptoController';

const method = 'POST';
const action = 'militarized-zone/me';
export class Me extends BaseComponent {
  constructor(router) {
    super(router, method, action);
    super.initialization(this.handler);
  }

  async handler(request, response, next) {
    const { user } = request.user;

    const cryptoController = new CryptoController();
    const transactionId = cryptoController.random();
    const client = await Transaction.getClient(Configuration.getDatabaseUri());
    const onOffTransaction = new Transaction(Configuration.getDatabaseName());
    await onOffTransaction.enableTransaction(client, transactionId);
    const users = new Transaction(
      Configuration.getDatabaseName(),
      'users',
    );
    const userData = await users.read(client, transactionId, {
      _id: Transaction.strToId(user),
    }, 0, 1);
    onOffTransaction.disableTransaction(client, transactionId);
    Transaction.disposeClient(client);

    super.res(response, 200, true, {
      message: 'Data received.',
      userId: user,
      username: userData[0].username,
    });
  }
}
