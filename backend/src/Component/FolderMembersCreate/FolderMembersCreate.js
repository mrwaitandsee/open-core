import BaseComponent from '../BaseComponent';
import Configuration from '../../Configuration';
import Transaction from '../../Core/Transaction';
import CryptoController from '../../Service/CryptoController';

const method = 'POST';
const action = 'militarized-zone/folder-members-management/folder-members';
export class FolderMembersCreate extends BaseComponent {
  constructor(router) {
    super(router, method, action);
    super.initialization(this.handler);
  }

  async handler(request, response, next) {
    const { user } = request.user;
    const cryptoController = new CryptoController();
    const transactionId = cryptoController.random();
    const client = await Transaction.getClient(Configuration.getDatabaseUri());
    const onOffTransaction = new Transaction(Configuration.getDatabaseName());
    const folderMembers = new Transaction(
      Configuration.getDatabaseName(),
      'folderMembers',
    );
    await onOffTransaction.enableTransaction(client, transactionId);
    const folderMember = {
      userId: Transaction.strToId(user),
      folderId: Transaction.strToId(request.body.folderId),
      invite: request.body.invite,
      operation: request.body.operation,
    }
    const data = await folderMembers.read(client, transactionId, {
      userId: folderMember.userId,
      folderId: folderMember.folderId,
    });
    if (data.length) {
      await onOffTransaction.disableTransaction(client, transactionId);
      super.res(response, 409, true, {
        message: 'Member already created.',
        data: folderMember,
      });
      return;
    }
    await folderMembers.create(client, transactionId, [
      folderMember,
    ]);
    await onOffTransaction.disableTransaction(client, transactionId);
    delete folderMember._transactionId;
    super.res(response, 200, true, {
      message: 'Member created.',
      data: folderMember,
    });
  }
}
