import BaseComponent from '../BaseComponent';
import jwt from 'jsonwebtoken';
import Configuration from '../../Configuration';
import CryptoController from '../../Service/CryptoController';
import HashController from '../../Service/HashController';
import Transaction from '../../Core/Transaction';

const method = 'POST';
const action = 'demilitarized-zone/login';
export class Login extends BaseComponent {
  constructor(router) {
    super(router, method, action);
    super.initialization(this.handler);
  }

  async handler(request, response, next) {
    const { username, password } = request.body;
    const client = await Transaction.getClient(Configuration.getDatabaseUri());
    const transactionUsers = new Transaction(
      Configuration.getDatabaseName(),
      'users',
    );
    const cryptoController = new CryptoController();
    const findUserTransaction = cryptoController.random();
    await transactionUsers.enableTransaction(client, findUserTransaction);
    const usrs = await transactionUsers.read(
      client,
      findUserTransaction,
      {
        username,
      },
      0,
      1,
    );
    await transactionUsers.disableTransaction(client, findUserTransaction);
    if (usrs.length > 0) {
      const transactionSecrets = new Transaction(
        Configuration.getDatabaseName(),
        'secrets',
      );
      const findSecretTransaction = cryptoController.random();
      await transactionSecrets.enableTransaction(client, findSecretTransaction);
      const scrts = await transactionSecrets.read(
        client,
        findSecretTransaction,
        {
          userId: usrs[0]._id,
        },
        0,
        1,
      );
      await transactionSecrets.disableTransaction(client, findSecretTransaction);

      if (scrts.length > 0) {
        const transactionEmailPasswordSecrets = new Transaction(
          Configuration.getDatabaseName(),
          'emailPasswordSecret',
        );
        const findEmailPasswordSecretTransaction = cryptoController.random();
        await transactionEmailPasswordSecrets.enableTransaction(
          client,
          findEmailPasswordSecretTransaction,
        );
        const emailPasswordSecrets = await transactionEmailPasswordSecrets
        .read(
          client,
          findEmailPasswordSecretTransaction,
          {
            secretId: scrts[0]._id,
          },
          0,
          1,
        );
        await transactionEmailPasswordSecrets.disableTransaction(
          client,
          findEmailPasswordSecretTransaction
        );
        Transaction.disposeClient(client);
        if (emailPasswordSecrets.length > 0) {
          const hashController = new HashController();
          const compare = await hashController.compare(
            password,
            emailPasswordSecrets[0].password
          );
          if (compare) {
            const accessToken = jwt.sign({
              user: usrs[0]._id,
              hash: emailPasswordSecrets[0].password,
            }, Configuration.getJwtSecret());
            response.status(200).json({
              success: true,
              message: 'Token has been successfully generated.',
              accessToken,
            });
            return;
          }
        }
      }
    }
    super.res(response, 401, false, 'Unauthorized.');
  }
}
