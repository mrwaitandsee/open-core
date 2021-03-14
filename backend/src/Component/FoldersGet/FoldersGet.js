import BaseComponent from '../BaseComponent';
import Configuration from '../../Configuration';
import CryptoController from '../../Service/CryptoController';
import Transaction from '../../Core/Transaction';

const method = 'GET';
const action = 'militarized-zone/folder-management/folder';
export class FoldersGet extends BaseComponent {
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
    await onOffTransaction.enableTransaction(client, transactionId);

    const folderMembers = new Transaction(
      Configuration.getDatabaseName(),
      'folderMembers',
    );
    const folders = new Transaction(
      Configuration.getDatabaseName(),
      'folders',
    );
    const userId = Transaction.strToId(user);

    const folderMembersData = await folderMembers.read(client, transactionId, {
      userId
    });
    const folderIds = [];
    folderMembersData.forEach((folderMember) => { folderIds.push(folderMember.folderId); });
    const getFolderPromises = [];
    folderIds.forEach((folderId) => {
      getFolderPromises.push(
        folders.read(client, transactionId, {
          _id: folderId,
        }, 0, 1)
      );
    });
    const foldersDirtData = await Promise.all(getFolderPromises);
    const foldersData = foldersDirtData.reduce((result, current) => {
      if (!current.length) return result;
      result.push({
        folder: current[0],
        rules: {},
      });
      return result;
    }, []);

    await onOffTransaction.disableTransaction(client, transactionId);

    super.res(response, 200, true, {
      message: 'The folders were received successfully.',
      data: foldersData,
    });
  }
}
