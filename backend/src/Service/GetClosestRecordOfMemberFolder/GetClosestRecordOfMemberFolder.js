import Configuration from '../../Configuration';
import Transaction from '../../Core/Transaction';
import GetParentDirsFromDir from '../GetParentDirsFromDir';

export default class GetClosestRecordOfMemberFolder  {
  constructor(client, transactionId, path, userId) {
    this.client = client;
    this.transactionId = transactionId;
    this.path = path;
    this.userId = userId;
  }

  async getRecord() {
    const dirs = new GetParentDirsFromDir(this.path).getParentDirs();
    const getFolderPromises = [];
    const folders = new Transaction(
      Configuration.getDatabaseName(),
      'folders',
    );
    dirs.forEach((dir) => {
      getFolderPromises.push(folders.read(this.client, this.transactionId, {
        path: dir,
      }));
    });
    const foldersData = await Promise.all(getFolderPromises);
    const folderIds = foldersData.reduce((accumulator, currentValue, index) => {
      if (index === foldersData.length - 1) return accumulator;
      if (currentValue.length === 0) throw new Error('Incorrect path (No folder in path).');
      accumulator.push(currentValue[0]._id);
      return accumulator;
    }, []);
    const folderMembers = new Transaction(
      Configuration.getDatabaseName(),
      'folderMembers',
    );
    const getFolderMemberPromises = [];
    folderIds.forEach((id) => {
      getFolderMemberPromises.push(folderMembers.read(this.client, this.transactionId, {
        userId: this.userId,
        folderId: id,
      }));
    });
    const folderMembersData = await Promise.all(getFolderMemberPromises);
    for (let i = 0; i < folderMembersData.length; i += 1) {
      if (folderMembersData[i].length > 0) {
        return folderMembersData[i][0];
      }
    }
    return undefined;
  }
}
