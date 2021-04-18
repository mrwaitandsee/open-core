import BaseComponent from '../BaseComponent';
import Configuration from '../../Configuration';
import Transaction from '../../Core/Transaction';
import CryptoController from '../../Service/CryptoController';

const method = 'PATCH';
const action = 'militarized-zone/app-references-management/app-references/:appReferenceId';
export class AppReferencesUpdate extends BaseComponent {
  constructor(router) {
    super(router, method, action);
    super.initialization(this.handler);
  }

  async handler(request, response, next) {
    const { user } = request.user;
    const { appReferenceId } = request.params;
    const userId = Transaction.strToId(user);

    const updatedObj = {};
    if (request.body.name) updatedObj.name = request.body.name;
    if (request.body.appHost) updatedObj.appHost = request.body.appHost;
    
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
      userId: Transaction.strToId(userId),
    }, 0, 1);
    if (!appReferencesData.length) {
      await onOffTransaction.disableTransaction(client, transactionId);
      super.res(response, 404, true, 'Cannot update this app ref.');
      return;
    }
    const isSuccess = await appReferences.update(client, transactionId, {
      _id: Transaction.strToId(appReferenceId),
      userId: Transaction.strToId(userId),
    }, updatedObj);
    await onOffTransaction.disableTransaction(client, transactionId);

    if (isSuccess) {
      super.res(response, 200, true, 'App ref updated successfully.');
    } else {
      super.res(response, 403, false, 'Cannot update this app ref.');
    }
  }
}
