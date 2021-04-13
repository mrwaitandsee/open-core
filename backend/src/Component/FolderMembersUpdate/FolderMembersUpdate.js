import BaseComponent from '../BaseComponent';
import Configuration from '../../Configuration';
import Transaction from '../../Core/Transaction';
import CryptoController from '../../Service/CryptoController';
import GetClosestRecordOfMemberFolder from '../../Service/GetClosestRecordOfMemberFolder';

const method = 'PATCH';
const action = 'militarized-zone/folder-members-management/folder-members/:folderMemberId';
export class FolderMembersUpdate extends BaseComponent {
  constructor(router) {
    super(router, method, action);
    super.initialization(this.handler);
  }

  async handler(request, response, next) {
    const { user } = request.user;
    const userId = Transaction.strToId(user);
    const { folderMemberId } = request.params;
    const { operation, invite } = request.body;
    const updateObject = {};
    if (operation) updateObject.operation = operation;
    if (typeof invite === 'boolean') updateObject.invite = invite;

    const cryptoController = new CryptoController();
    const transactionId = cryptoController.random();
    const client = await Transaction.getClient(Configuration.getDatabaseUri());
    const onOffTransaction = new Transaction(Configuration.getDatabaseName());
    await onOffTransaction.enableTransaction(client, transactionId);

    const folderMembers = new Transaction(Configuration.getDatabaseName(), 'folderMembers');
    const folders = new Transaction(Configuration.getDatabaseName(), 'folders');
    const membersData = await folderMembers.read(client, transactionId, {
      _id: Transaction.strToId(folderMemberId),
    }, 0, 1);
    if (!membersData.length) {
      await onOffTransaction.disableTransaction(client, transactionId);
      super.res(response, 404, true, 'Cannot find member.');
      return;
    }
    const tempFolderData = await folders.read(client, transactionId, {
      _id: membersData[0].folderId
    }, 0, 1);
    if (!tempFolderData.length) {
      await onOffTransaction.disableTransaction(client, transactionId);
      super.res(response, 404, true, 'Cannot find folder.');
      return;
    }
    const getClosestRecordOfMemberFolder = new GetClosestRecordOfMemberFolder(client, transactionId, tempFolderData[0].path, userId);
    const closestRecord = await getClosestRecordOfMemberFolder.getRecord();
    if (!closestRecord) {
      await onOffTransaction.disableTransaction(client, transactionId);
      super.res(response, 403, true, 'Forbidden. Not enough rights.');
      return;
    }
    if (closestRecord.operation !== 'w') {
      await onOffTransaction.disableTransaction(client, transactionId);
      super.res(response, 403, true, 'Forbidden. Not enough rights.');
      return;
    }

    await folderMembers.update(client, transactionId, {
      _id: membersData[0]._id,
    }, updateObject);

    await onOffTransaction.disableTransaction(client, transactionId);
    super.res(response, 200, true, 'Updated successfully.');
  }
}
