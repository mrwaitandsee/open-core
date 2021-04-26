import BaseComponent from '../BaseComponent';
import Configuration from '../../Configuration';
import Transaction from '../../Core/Transaction';
import CryptoController from '../../Service/CryptoController';
import GetClosestRecordOfMemberFolder from '../../Service/GetClosestRecordOfMemberFolder';

const method = 'DELETE';
const action = 'militarized-zone/apps-management/apps/:appId';
export class AppsDelete extends BaseComponent {
  constructor(router) {
    super(router, method, action);
    super.initialization(this.handler);
  }

  async handler(request, response, next) {
    const { user } = request.user;
    const { appId } = request.params;
    
    const userIdKey = Transaction.strToId(user);
    const appIdKey = Transaction.strToId(appId);

    const cryptoController = new CryptoController();
    const transactionId = cryptoController.random();
    const client = await Transaction.getClient(Configuration.getDatabaseUri());
    const onOffTransaction = new Transaction(Configuration.getDatabaseName());
    await onOffTransaction.enableTransaction(client, transactionId);
    const apps = new Transaction(
      Configuration.getDatabaseName(),
      'apps',
    );

    const folders = new Transaction(
      Configuration.getDatabaseName(),
      'folders',
    );

    const appsData = await apps.read(client, transactionId, {
      _id: appIdKey,
      userId: userIdKey,
    }, 0, 1);
    if (!appsData.length) {
      await onOffTransaction.disableTransaction(client, transactionId);
      super.res(response, 404, false, 'Cannot delete this app.');
      return;
    }

    const foldersData = await folders.read(client, transactionId, {
      _id: appsData[0].folderId,
    }, 0, 1);
    if (!foldersData.length) {
      await onOffTransaction.disableTransaction(client, transactionId);
      super.res(response, 404, false, 'Cannot delete this app. Cannot find folder.');
      return;
    }

    const getClosestRecordOfMemberFolder = new GetClosestRecordOfMemberFolder(client, transactionId, foldersData[0].path, userIdKey);
    const closestRecordOfMemberFolder = await getClosestRecordOfMemberFolder.getRecord();

    if (!closestRecordOfMemberFolder) {
      await onOffTransaction.disableTransaction(client, transactionId);
      super.res(response, 403, false, 'Not enough rights.');
      return;
    }
    if (closestRecordOfMemberFolder.operation !== 'w') {
      await onOffTransaction.disableTransaction(client, transactionId);
      super.res(response, 403, false, 'Not enough rights.');
      return;
    }

    const isSuccess = await apps.delete(client, transactionId, {
      _id: appIdKey,
    });
    await onOffTransaction.disableTransaction(client, transactionId);

    if (isSuccess) {
      super.res(response, 200, true, 'App deleted successfully.');
    } else {
      super.res(response, 403, false, 'Cannot delete this app.');
    }
  }
}
