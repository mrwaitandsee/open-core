import Configuration from '../../Configuration';
import Transaction from '../../Core/Transaction';

export default class GetAllChildFolders {
  constructor(client, transactionId, folderId) {
    this.client = client;
    this.transactionId = transactionId;
    this.folderId = folderId;
  }

  async getFolders() {
    const { client, transactionId, folderId } = this;
    const folders = new Transaction(
      Configuration.getDatabaseName(),
      'folders',
    );
    const allFolders = [];
    async function getAllFolders(parentFolderId, actionGetAllFolders) {
      const data = await folders.read(client, transactionId, {
        parentFolder: parentFolderId,
      });
      for (let i = 0; i < data.length; i += 1) {
        allFolders.push(data[i]);
      }
      const promises = [];
      for (let i = 0; i < data.length; i += 1) {
        promises.push(actionGetAllFolders(data[i]._id, actionGetAllFolders));
      }
      await Promise.all(promises);
    }
    await getAllFolders(folderId, getAllFolders);
    return allFolders;
  }
}
