import BaseComponent from '../BaseComponent';
import jwt from 'jsonwebtoken';
import Configuration from '../../Configuration';
import CryptoController from '../../Service/CryptoController';
import Transaction from '../../Core/Transaction';
import GetClosestRecordOfMemberFolder from '../../Service/GetClosestRecordOfMemberFolder';

const method = 'POST';
const action = 'demilitarized-zone/apps-management/check-token-for-app';
export class CheckTokenForApp extends BaseComponent {
  constructor(router) {
    super(router, method, action);
    super.initialization(this.handler);
  }

  async handler(request, response, next) {
    const { accessToken } = request.body;
    
    try {
      const data = await jwt.verify(accessToken, Configuration.getJwtSecret());
      const { user, app } = data;
      const userId = Transaction.strToId(user);
      const appId = Transaction.strToId(app);

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
        _id: appId,
      }, 0, 1);
      if (!appsData.length) {
        await onOffTransaction.disableTransaction(client, transactionId);
        super.res(response, 404, false, 'Cannot check token. Cannot find app.');
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
        super.res(response, 404, false, 'Cannot check token. Cannot find folder.');
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

      super.res(response, 200, true, {
        message: 'Success.',
        userId,
        appId,
        permissions: {
          operation: closestRecordOfMemberFolder.operation,
          invite: closestRecordOfMemberFolder.invite,
        },
      });
    } catch (err) {
      console.log(err);
      super.res(response, 401, false, {
        message: 'Bad token.',
      });
    }
  }
}
