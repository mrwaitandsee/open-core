import BaseComponent from '../BaseComponent';
import Configuration from '../../Configuration';
import Transaction from '../../Core/Transaction';
import CryptoController from '../../Service/CryptoController';

const method = 'GET';
const action = 'militarized-zone/app-references-management/app-references';
export class AppReferencesGet extends BaseComponent {
  constructor(router) {
    super(router, method, action);
    super.initialization(this.handler);
  }

  async handler(request, response, next) {
    const { user } = request.user;
    const userId = Transaction.strToId(user);
    
    const cryptoController = new CryptoController();
    const transactionId = cryptoController.random();
    const client = await Transaction.getClient(Configuration.getDatabaseUri());
    const onOffTransaction = new Transaction(Configuration.getDatabaseName());
    await onOffTransaction.enableTransaction(client, transactionId);
    const appReferences = new Transaction(
      Configuration.getDatabaseName(),
      'appReferences',
    );
    const appReferencesData = await appReferences.read(client, transactionId, {
      userId,
    });
    await onOffTransaction.disableTransaction(client, transactionId);
    super.res(response, 200, true, appReferencesData);
  }
}
