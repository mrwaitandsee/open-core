import BaseComponent from '../BaseComponent';
import Configuration from '../../Configuration';
import Transaction from '../../Core/Transaction';
import CryptoController from '../../Service/CryptoController';
import GetClosestRecordOfMemberFolder from '../../Service/GetClosestRecordOfMemberFolder';

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
    
    const folders = new Transaction(
      Configuration.getDatabaseName(),
      'folders',
    );

    const foldersData = await folders.read(client, transactionId, {
      _id: Transaction.strToId(folderId),
    }, 0, 1);
    if (!foldersData.length) {
      await onOffTransaction.disableTransaction(client, transactionId);
      super.res(response, 404, false, 'Cannot find folder.');
      return;
    }
    const getClosestRecordOfMemberFolder = new GetClosestRecordOfMemberFolder(client, transactionId, foldersData[0].path, userId);
    const record = await getClosestRecordOfMemberFolder.getRecord();
    if (!record) {
      await onOffTransaction.disableTransaction(client, transactionId);
      super.res(response, 403, false, 'Not enough rights.');
      return;
    }
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
      super.res(response, 404, false, 'Cannot find this app ref.');
      return;
    }

    const apps = new Transaction(
      Configuration.getDatabaseName(),
      'apps',
    );

    const appsData = await apps.read(client, transactionId, {
      userId,
      folderId: Transaction.strToId(folderId),
      title,
    }, 0, 1);
    if (appsData.length) {
      await onOffTransaction.disableTransaction(client, transactionId);
      super.res(response, 409, false, 'App with this title already exists.');
      return;
    }

    const success = await apps.create(client, transactionId, [
      {
        userId,
        folderId: Transaction.strToId(folderId),
        appReferenceId: Transaction.strToId(appReferenceId),
        title,
      },
    ]);

    if (success) {
      await onOffTransaction.disableTransaction(client, transactionId);
      super.res(response, 200, true, 'App created.');
    } else {
      await onOffTransaction.disableTransaction(client, transactionId);
      super.res(response, 501, false, 'App not created.');
    }
  }
}
