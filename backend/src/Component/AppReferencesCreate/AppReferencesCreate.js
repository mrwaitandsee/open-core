import BaseComponent from '../BaseComponent';
import Configuration from '../../Configuration';
import Transaction from '../../Core/Transaction';
import CryptoController from '../../Service/CryptoController';

const method = 'POST';
const action = 'militarized-zone/app-references-management/app-references';
export class AppReferencesCreate extends BaseComponent {
  constructor(router) {
    super(router, method, action);
    super.initialization(this.handler);
  }

  async handler(request, response, next) {
    const { user } = request.user;
    const { name, appHost } = request.body;
    const userId = Transaction.strToId(user);
    const appReference = {
      name,
      appHost,
      userId,
    };
    const cryptoController = new CryptoController();
    const transactionId = cryptoController.random();
    const client = await Transaction.getClient(Configuration.getDatabaseUri());
    const onOffTransaction = new Transaction(Configuration.getDatabaseName());
    await onOffTransaction.enableTransaction(client, transactionId);
    const appReferences = new Transaction(
      Configuration.getDatabaseName(),
      'appReferences',
    );
    const appReferencesData = await appReferences.read(client, transactionId, appReference, 0, 1);
    if (appReferencesData.length !== 0) {
      await onOffTransaction.disableTransaction(client, transactionId);
      super.res(response, 409, false, 'App reference already exists.');
      return;
    }
    const isSuccess = await appReferences.create(client, transactionId, [ appReference ]);
    await onOffTransaction.disableTransaction(client, transactionId);
    if (isSuccess) {
      super.res(response, 200, true, 'App reference created.');
    } else {
      super.res(response, 500, true, 'App reference not created.');
    }
  }
}
