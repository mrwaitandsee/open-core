import BaseComponent from '../BaseComponent';
import jwt from 'jsonwebtoken';
import Configuration from '../../Configuration';
import CryptoController from '../../Service/CryptoController';
import Transaction from '../../Core/Transaction';
import GetClosestRecordOfMemberFolder from '../../Service/GetClosestRecordOfMemberFolder';

const method = 'POST';
const action = 'militarized-zone/apps-management/generate-token-for-app/:appId';
export class GenerateTokenForApp extends BaseComponent {
  constructor(router) {
    super(router, method, action);
    super.initialization(this.handler);
  }

  async handler(request, response, next) {
    const { user } = request.user;
    const userId = Transaction.strToId(user);
    const appId = Transaction.strToId(request.params.appId);
    
    const cryptoController = new CryptoController();
    const transactionId = cryptoController.random();
    const client = await Transaction.getClient(Configuration.getDatabaseUri());
    const onOffTransaction = new Transaction(Configuration.getDatabaseName());
    await onOffTransaction.enableTransaction(client, transactionId);
    const apps = new Transaction(
      Configuration.getDatabaseName(),
      'apps',
    );

    const appsData = await apps.read(client, transactionId, {
      _id: Transaction.strToId(appId),
    }, 0, 1);
    if (!appsData.length) {
      await onOffTransaction.disableTransaction(client, transactionId);
      super.res(response, 404, false, 'Cannot generate token. Cannot find app.');
      return;
    }

    const folders = new Transaction(
      Configuration.getDatabaseName(),
      'folders',
    );
    const foldersData = await folders.read(client, transactionId, {
      _id: appsData[0].folderId,
    }, 0, 1);
    if (!foldersData.length) {
      await onOffTransaction.disableTransaction(client, transactionId);
      super.res(response, 404, false, 'Cannot generate token. Cannot find folder.');
      return;
    }
    
    const getClosestRecordOfMemberFolder = new GetClosestRecordOfMemberFolder(client, transactionId, foldersData[0].path, userId);
    const closestRecordOfMemberFolder = await getClosestRecordOfMemberFolder.getRecord();
    if (!closestRecordOfMemberFolder) {
      await onOffTransaction.disableTransaction(client, transactionId);
      super.res(response, 403, false, 'Not enough rights.');
      return;
    }

    await onOffTransaction.disableTransaction(client, transactionId);

    const accessToken = jwt.sign({
      user: userId,
      app: appId,
    }, Configuration.getJwtSecret());

    super.res(response, 200, true, {
      message: 'Token for app has been successfully generated.',
      accessToken,
    });
  }
}
