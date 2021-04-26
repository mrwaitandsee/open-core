import Configuration from '../../Configuration';
import Transaction from '../../Core/Transaction';
import CryptoController from '../../Service/CryptoController';
import GetClosestRecordOfMemberFolder from '../../Service/GetClosestRecordOfMemberFolder';
 
export default class GetAppsByFolderId {
  constructor(userId, folderId) {
    this.userId = userId;
    this.folderId = folderId;
  }

  async getApps() {
    const cryptoController = new CryptoController();
    const transactionId = cryptoController.random();
    const client = await Transaction.getClient(Configuration.getDatabaseUri());
    const onOffTransaction = new Transaction(Configuration.getDatabaseName());

    await onOffTransaction.enableTransaction(client, transactionId);

    const folders = new Transaction(
      Configuration.getDatabaseName(),
      'folders',
    );
    // check on folder exists
    const foldersData = await folders.read(client, transactionId, {
      _id: this.folderId, 
    });
    if (!foldersData.length) {
      await onOffTransaction.disableTransaction(client, transactionId);
      return {
        code: 404,
        message: 'Folder not found.',
        data: null,
        status: false,
      }
    }
    // check members
    const getClosestRecordOfMemberFolder = new GetClosestRecordOfMemberFolder(
      client, transactionId, foldersData[0].path, this.userId);
    const closestRecordOfMemberFolder = await getClosestRecordOfMemberFolder.getRecord();
    if (!closestRecordOfMemberFolder) {
      await onOffTransaction.disableTransaction(client, transactionId);
      return {
        code: 403,
        message: 'Not enough rights.',
        data: null,
        status: false,
      }
    }
    // get apps
    const apps = new Transaction(
      Configuration.getDatabaseName(),
      'apps',
    );
    const result = await apps.read(client, transactionId, {
      userId: this.userId,
      folderId: this.folderId,
    });
    await onOffTransaction.disableTransaction(client, transactionId);
    return {
      code: 200,
      message: 'Success.',
      data: result,
      status: true,
    }
  }
}
