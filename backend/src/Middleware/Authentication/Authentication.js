import Configuration from '../../Configuration';
import jwt from 'jsonwebtoken';
import CryptoController from '../../Service/CryptoController';
import Transaction from '../../Core/Transaction';

export default class Authentication {
  constructor(app) {
    app.use('/api/militarized-zone', async (req, res, next) => {
      try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) return res.sendStatus(403);
        const token = authHeader.split(' ')[1];
        //Bearer TOKEN
        if (!token) {
          return res.sendStatus(401);
        } else {
          const user = await jwt.verify(token, Configuration.getJwtSecret());
          user.user = Transaction.strToId(user.user);
          const client = await Transaction.getClient(Configuration.getDatabaseUri());
          const cryptoController = new CryptoController();
          const transactionId = cryptoController.random();
          const transactionSecrets = new Transaction(
            Configuration.getDatabaseName(),
            'secrets',
          );
          await transactionSecrets.enableTransaction(client, transactionId);
          const scrts = await transactionSecrets.read(client, transactionId, {
              userId: user.user,
            }, 0, 1,
          );
          if (scrts.length > 0) {
            const transactionEmailPasswordSecrets = new Transaction(
              Configuration.getDatabaseName(),
              'emailPasswordSecret',
            );
            const emailPasswordSecrets = await transactionEmailPasswordSecrets.read(client, transactionId,
              {
                secretId: scrts[0]._id,
              }, 0, 1,
            );
            if (emailPasswordSecrets.length > 0) {
              if (emailPasswordSecrets[0].password === user.hash) {
                req.user = user;
              } else {
                return res.sendStatus(401);
              }
            } else {
              return res.sendStatus(401);
            }
          } else {
            return res.sendStatus(401);
          }
          await transactionSecrets.disableTransaction(client, transactionId);
        }
        next();
      } catch(err) {
        return res.sendStatus(401);
      }
    });
    console.log('Authentication middleware has been created');
    console.log();
  }
}
