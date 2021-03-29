import BaseComponent from '../BaseComponent';
import Configuration from '../../Configuration';
import Transaction from '../../Core/Transaction';
import CryptoController from '../../Service/CryptoController';
import GetClosestRecordOfMemberFolder from '../../Service/GetClosestRecordOfMemberFolder';
import GetParentDirsFromDir from '../../Service/GetParentDirsFromDir';

const method = 'GET';
const action = 'militarized-zone/folder-management/folder-members/:folderId';
export class FolderMembersGetByFolderId extends BaseComponent {
  constructor(router) {
    super(router, method, action);
    super.initialization(this.handler);
  }

  async handler(request, response, next) {
    const { user } = request.user;
    const { folderId } = request.params;
    const cryptoController = new CryptoController();
    const transactionId = cryptoController.random();
    const client = await Transaction.getClient(Configuration.getDatabaseUri());
    const onOffTransaction = new Transaction(Configuration.getDatabaseName());
    const folders = new Transaction(
      Configuration.getDatabaseName(),
      'folders',
    );
    const folderMembers = new Transaction(
      Configuration.getDatabaseName(),
      'folderMembers',
    );
    const users = new Transaction(
      Configuration.getDatabaseName(),
      'users',
    );
    await onOffTransaction.enableTransaction(client, transactionId);
    const foldersData = await folders.read(client, transactionId, {
      _id: Transaction.strToId(folderId),
    }, 0, 1);
    if (!foldersData.length) {
      await onOffTransaction.disableTransaction(client, transactionId);
      super.res(response, 409, true, 'You cannot take this action.');
    }
    const getClosestRecordOfMemberFolder = new GetClosestRecordOfMemberFolder(client, transactionId, foldersData[0].path, user);
    if (!getClosestRecordOfMemberFolder) {
      await onOffTransaction.disableTransaction(client, transactionId);
      super.res(response, 409, true, 'You cannot take this action.');
    }
    const dirs = new GetParentDirsFromDir(foldersData[0].path).getParentDirs();
    const getFolderPromises = [];
    dirs.forEach((dir) => {
      getFolderPromises.push(folders.read(client, transactionId, {
        path: dir,
      }));
    });
    const foldersDataAll = await Promise.all(getFolderPromises);
    const foldersDataProcessed = foldersDataAll.reduce((accumulator, currentValue, index) => {
      if (index === foldersDataAll.length - 1) return accumulator;
      if (currentValue.length === 0) throw new Error('Incorrect path (No folder in path).');
      accumulator.push(currentValue[0]);
      return accumulator;
    }, []);
    const promises = [];
    for (let i = 0; i < foldersDataProcessed.length; i += 1) {
      promises.push(
        folderMembers.read(client, transactionId, {
          folderId: foldersDataProcessed[i]._id,
        })
      );
    }
    const members = await Promise.all(promises);
    const map = new Map();
    for (let i = 0; i < members.length; i += 1) {
      for (let j = 0; j < members[i].length; j += 1) {
        if (!map.has(members[i][j].userId)) {
          map.set(members[i][j].userId, members[i][j]);
        }
      }
    }
    const preResult = [];
    map.forEach((it) => {
      preResult.push(it);
    });
    async function buildMember(memberDoc) {
      const userData = await users.read(client, transactionId, {
        _id: memberDoc.userId,
      }, 0, 1);
      const folderData = await folders.read(client, transactionId, {
        _id: memberDoc.folderId,
      }, 0, 1);
      memberDoc.user = userData[0];
      memberDoc.folder = folderData[0];
      return memberDoc;
    }
    let result = [];
    for (let i = 0; i < preResult.length; i += 1) {
      result.push(buildMember(preResult[i]));
    }
    result = await Promise.all(result);
    await onOffTransaction.disableTransaction(client, transactionId);
    super.res(response, 200, true, {
      message: 'Members received successfully.',
      data: result,
    });
  }
}
