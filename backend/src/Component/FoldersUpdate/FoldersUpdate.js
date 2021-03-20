import BaseComponent from '../BaseComponent';
import Configuration from '../../Configuration';
import CryptoController from '../../Service/CryptoController';
import Transaction from '../../Core/Transaction';
import GetClosestRecordOfMemberFolder from '../../Service/GetClosestRecordOfMemberFolder';

const method = 'PATCH';
const action = 'militarized-zone/folder-management/folder/:folderId';
export class FoldersUpdate extends BaseComponent {
  constructor(router) {
    super(router, method, action);
    super.initialization(this.handler);
  }

  async handler(request, response, next) {
    const { user } = request.user;
    const { folderId } = request.params;    
    const { name } = request.body;
    const cryptoController = new CryptoController();
    const transactionId = cryptoController.random();
    const client = await Transaction.getClient(Configuration.getDatabaseUri());
    const onOffTransaction = new Transaction(Configuration.getDatabaseName());
    await onOffTransaction.enableTransaction(client, transactionId);
    const folders = new Transaction(
      Configuration.getDatabaseName(),
      'folders',
    );
    const userId = Transaction.strToId(user);
    const foldersDataParentFolder = await folders.read(client, transactionId, {
      _id: Transaction.strToId(folderId),
    }, 0, 1);
    if (!foldersDataParentFolder.length) {
      await onOffTransaction.disableTransaction(client, transactionId);
      super.res(response, 404, false, 'Cannot find folder.');
      return;
    }
    const getClosestRecordForParentFolder = new GetClosestRecordOfMemberFolder(client, transactionId, foldersDataParentFolder[0].path, userId);
    const record = await getClosestRecordForParentFolder.getRecord();
    if (!record) {
      await onOffTransaction.disableTransaction(client, transactionId);
      super.res(response, 403, false, 'Not enough rights.');
      return;
    }

    await onOffTransaction.disableTransaction(client, transactionId);
    super.res(response, 200, true, 'Updated successfully.');
  }
}
