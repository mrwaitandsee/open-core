import CryptoController from '../CryptoController';
import Configuration from '../../Configuration';
import Transaction from '../../Core/Transaction';
import IsFolderExists from '../IsFolderExists';
import GetClosestRecordOfMemberFolder from '../GetClosestRecordOfMemberFolder';

export default class CreateFolder {
  constructor(user, path) {
    this.userId = Transaction.strToId(user.user);
    this.path = path;
    const cryptoController = new CryptoController();
    this.transactionId = cryptoController.random();
  }

  async create() {
    const { transactionId, userId, path } = this;
    const users = new Transaction(
      Configuration.getDatabaseName(),
      'users',
    );
    const folders = new Transaction(
      Configuration.getDatabaseName(),
      'folders',
    );
    const folderMembers = new Transaction(
      Configuration.getDatabaseName(),
      'folderMembers',
    );
    const client = await Transaction.getClient(Configuration.getDatabaseUri());
    await users.enableTransaction(client, transactionId);
    const usersData = await users.read(client, transactionId, {
      _id:  userId,
    });
    if (usersData.length === 0) {
      await users.disableTransaction(client, transactionId);
      return { error: 404, message: 'Cannot find user.', success: false };
    }
    const user = usersData[0];
    
    const foldersDataIsExists = await new IsFolderExists(client, transactionId, path).isExists();
    if (foldersDataIsExists) {
      await users.disableTransaction(client, transactionId);
      return { error: 409, message: 'Folder already exists.', success: false };
    }

    let parentPath = path.split('/');
    parentPath.pop();
    parentPath = parentPath.join('/')
    const getterClosestRecordOfMemberFolder = new GetClosestRecordOfMemberFolder(client, transactionId, parentPath, userId);
    const closestFolderMember = await getterClosestRecordOfMemberFolder.getRecord();
    if (!closestFolderMember) {
      if (path.split('/')[0] == userId) {
        await folders.create(client, transactionId, [{ path }]);
        const newFolder = (await folders.read(client, transactionId, { path }))[0];
        await folderMembers.create(client, transactionId, [
          {
            userId,
            folderId: newFolder._id,
            invite: true,
            operation: 'w',
          }
        ]);
        await users.disableTransaction(client, transactionId);
        return { error: 200, message: 'Folder created.', success: true };
      } else {
        await users.disableTransaction(client, transactionId);
        return { error: 403, message: 'Forbidden to create folder.', success: false };
      }
    } else {
      if (closestFolderMember.operation === 'w') {
        await folders.create(client, transactionId, [{ path }]);
        await users.disableTransaction(client, transactionId);
        return { error: 200, message: 'Folder created.', success: true };
      } else {
        await users.disableTransaction(client, transactionId);
        return { error: 403, message: 'Forbidden to create folder.', success: false };
      }
    }
  }
}
