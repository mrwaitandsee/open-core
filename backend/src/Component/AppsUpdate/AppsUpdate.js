import BaseComponent from '../BaseComponent';
import Configuration from '../../Configuration';
import Transaction from '../../Core/Transaction';
import CryptoController from '../../Service/CryptoController';

const method = 'PATCH';
const action = 'militarized-zone/apps-management/apps/:appId';
export class AppsUpdate extends BaseComponent {
  constructor(router) {
    super(router, method, action);
    super.initialization(this.handler);
  }

  async handler(request, response, next) {
    const { user } = request.user;
    const { appId } = request.params;
    const userId = Transaction.strToId(user);

    const updatedObj = {};
    if (request.body.title) updatedObj.title = request.body.title;
    
    const cryptoController = new CryptoController();
    const transactionId = cryptoController.random();
    const client = await Transaction.getClient(Configuration.getDatabaseUri());
    const onOffTransaction = new Transaction(Configuration.getDatabaseName());
    await onOffTransaction.enableTransaction(client, transactionId);
    const apps = new Transaction(
      Configuration.getDatabaseName(),
      'apps',
    );

    const appsData = await apps.read(client, transactionId, {
      _id: Transaction.strToId(appId),
      userId,
    }, 0, 1);
    if (!appsData.length) {
      await onOffTransaction.disableTransaction(client, transactionId);
      super.res(response, 404, true, 'Cannot update this app.');
      return;
    }
    if (appsData[0].title === updatedObj.title) {
      await onOffTransaction.disableTransaction(client, transactionId);
      super.res(response, 409, false, 'App with this title already exists.');
      return;
    }
    const isSuccess = await apps.update(client, transactionId, {
      _id: Transaction.strToId(appId),
      userId,
    }, updatedObj);
    await onOffTransaction.disableTransaction(client, transactionId);

    if (isSuccess) {
      super.res(response, 200, true, 'App updated successfully.');
    } else {
      super.res(response, 403, false, 'Cannot update this app ref.');
    }
  }
}
