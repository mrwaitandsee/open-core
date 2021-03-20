import BaseComponent from '../BaseComponent';
import Configuration from '../../Configuration';
import CryptoController from '../../Service/CryptoController';
import Transaction from '../../Core/Transaction';
import GetClosestRecordOfMemberFolder from '../../Service/GetClosestRecordOfMemberFolder';

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
    const foldersDataNoSorted = foldersDirtData.reduce((result, current) => {
      if (!current.length) return result;
      result.push(current[0]);
      return result;
    }, []);
    let foldersData = foldersDataNoSorted.sort((a, b) => {
      return a.path.length - b.path.length;
    });

    for (let i = 0; i < foldersData.length; i += 1) {
      for (let j = i + 1; j < foldersData.length; j += 1) {
        if (foldersData[i].path === foldersData[j].path.substr(0, foldersData[i].path.length)) {
          foldersData[j]._remove = true;
        }
      }
    }
    const resultedFolders = foldersData.reduce((accumulator, current) => {
      if (!current._remove) accumulator.push(current);
      return accumulator;
    }, []);

    const resultedMemberPromises = [];
    for (let i = 0; i < resultedFolders.length; i += 1) {
      const controller = new GetClosestRecordOfMemberFolder(client, transactionId, resultedFolders[i].path, userId);
      resultedMemberPromises.push(controller.getRecord());
    };
    const resulterMembers = await Promise.all(resultedMemberPromises);
    const result = resultedFolders.map((value, index) => {
      return {
        folder: value,
        rules: resulterMembers[index],
      };
    });

    await onOffTransaction.disableTransaction(client, transactionId);

    super.res(response, 200, true, {
      message: 'The folders were received successfully.',
      data: result,
    });
  }
}
