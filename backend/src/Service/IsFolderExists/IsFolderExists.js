import Configuration from '../../Configuration';
import Transaction from '../../Core/Transaction';

export default class IsFolderExists {
  constructor(client, transactionId, path) {
    this.client = client;
    this.transactionId = transactionId;
    this.path = path;
  }

  async isExists() {
    const folders = new Transaction(
      Configuration.getDatabaseName(),
      'folders',
    );
    const foldersDataIsExists = await folders.read(this.client, this.transactionId, { path: this.path });
    if (foldersDataIsExists.length > 0) return true;
    return false;
  }
}
