import BaseComponent from '../BaseComponent';
import Configuration from '../../Configuration';
import Transaction from '../../Core/Transaction';
import CryptoController from '../../Service/CryptoController';

const method = 'POST';
const action = 'militarized-zone/apps-management/apps';
export class AppsCreate extends BaseComponent {
  constructor(router) {
    super(router, method, action);
    super.initialization(this.handler);
  }

  async handler(request, response, next) {
    const { user } = request.user;
    const { title, folderId, appReferenceId } = request.body;

    if (!title) {
      super.res(response, 400, false, 'Incorrect title.');
      return;
    } else if (!title.length) {
      super.res(response, 400, false, 'Incorrect title.');
      return;
    }

    const userId = Transaction.strToId(user);

    const cryptoController = new CryptoController();
    const transactionId = cryptoController.random();
    const client = await Transaction.getClient(Configuration.getDatabaseUri());
    const onOffTransaction = new Transaction(Configuration.getDatabaseName());
    await onOffTransaction.enableTransaction(client, transactionId);
    


    await onOffTransaction.disableTransaction(client, transactionId);
    super.res(response, 200, true, 'App created.');
  }
}
