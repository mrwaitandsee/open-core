import HashController from '../../Service/HashController';
import CryptoController from '../CryptoController';
import Configuration from '../../Configuration';
import Transaction from '../../Core/Transaction';
import MailerController from '../MailerController';

export default class CreateUser {
  constructor(username, email) {
    this.username = username;
    this.email = email;
    this.hashController = new HashController();
    const cryptoController = new CryptoController();
    this.password = cryptoController.random(8);
    this.transactionId = cryptoController.random();
    this.mailer = new MailerController(
      Configuration.getMailerService(),
      Configuration.getMailerHost(),
      Configuration.getMailerAuthUser(),
      Configuration.getMailerAuthPass(),
    );
  }

  async create() {
    const hashController = new HashController();
    const hash = await hashController.hash(this.password);

    const users = new Transaction(
      Configuration.getDatabaseName(),
      'users',
    );
    const secrets = new Transaction(
      Configuration.getDatabaseName(),
      'secrets',
    );
    const emailPasswordSecret = new Transaction(
      Configuration.getDatabaseName(),
      'emailPasswordSecret',
    );

    const client = await Transaction.getClient(Configuration.getDatabaseUri());
    await users.enableTransaction(client, this.transactionId);
    await users.create(client, this.transactionId, [ { username: this.username } ]);
    const user = await users.read(client, this.transactionId, { username: this.username }, 0, 1);
    await secrets.create(client, this.transactionId, [ { userId: user[0] ? user[0]._id : null } ]);
    const secret = await secrets.read(client, this.transactionId, { userId: user[0] ? user[0]._id : null }, 0, 1);
    await emailPasswordSecret.create(client, this.transactionId, [
      {
        email: this.email,
        password: hash,
        secretId: secret[0] ? secret[0]._id : null,
      },
    ]);
    this.mailer.send(
      Configuration.getMailerAuthUser(),
      this.email,
      'OpenCore User created.',
      `Thank you for registering at OpenCore.\nYour username: ${this.username}\nYour password: ${this.password}\nAfter reading the letter, remember the password and delete this letter.`,
    );
    const result = await users.disableTransaction(client, this.transactionId);
    Transaction.disposeClient(client);
    return result;
  }
}
