import BaseComponent from '../BaseComponent';
import Configuration from '../../Configuration';
import Transaction from '../../Core/Transaction';
import CryptoController from '../../Service/CryptoController';

const method = 'GET';
const action = 'militarized-zone/app-references-management/app-references/:appReferenceId';
export class AppReferencesGetByAppReferenceId extends BaseComponent {
  constructor(router) {
    super(router, method, action);
    super.initialization(this.handler);
  }

  async handler(request, response, next) {
    const { user } = request.user;
    const { appReferenceId } = request.params;
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
      _id: Transaction.strToId(appReferenceId),
      userId,
    }, 0, 1);
    if (!appReferencesData.length) {
      await onOffTransaction.disableTransaction(client, transactionId);
      super.res(response, 404, true, 'Cannot find this app ref.');
      return;
    }
    await onOffTransaction.disableTransaction(client, transactionId);
    super.res(response, 200, true, appReferencesData[0]);
  }
}
