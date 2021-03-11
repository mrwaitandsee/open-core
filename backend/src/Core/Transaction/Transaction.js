import Repository from '../Repository';

export default class Transaction {
  constructor(databaseName, collectionName) {
    this.databaseName = databaseName;
    this.collectionName = collectionName;
    this.repositoryOfCore = new Repository('CORE', 'transactions');
    this.repository = new Repository(
      this.databaseName, this.collectionName,
    );
  }

  static strToId(id) {
    return Repository.strToId(id);
  }

  static async getClient(dbUri) {
		return Repository.getClient(dbUri);
	}

	static disposeClient(client) {
    Repository.disposeClient(client);
  }

  async _addCollectionToTransaction(client, transactionId) {
    const transaction = await this._getTransaction(client, transactionId);
    if (transaction) {
      const set = new Set(transaction.collections);
      set.add(`${this.databaseName};${this.collectionName}`);
      transaction.collections = Array.from(set);
      const response = await this.repositoryOfCore.update(
        client,
        {
          transactionId,
        },
        {
          collections: transaction.collections,
        },
      );
      return response.success;
    }
    return false;
  }

  async _getTransaction(client, transactionId) {
    const response = await this.repositoryOfCore.read(client, {
      transactionId,
    }, 0, 1);
    if (!response.success) return null;
    if (response.data.length) return response.data[0];
    return null;
  }

  async enableTransaction(client, transactionId) {
    const transaction = await this._getTransaction(client, transactionId);
    if (transaction !== null) return false;
    const response = await this.repositoryOfCore.create(client, [
      {
        transactionId,
        collections: [],
        timestamp: new Date(),
      }
    ]);
    return response.success;
  }

  async disableTransaction(client, transactionId) {
    const transaction = await this._getTransaction(client, transactionId);
    if (transaction === null) return false;
    const { collections } = transaction;
    const removeTransaction = async (client, collection, transactionId) => {
      const data = collection.split(';');
      const dbName = data[0];
      const collectionName = data[1];
      const repository = new Repository(dbName, collectionName);
      const resRead = await repository.read(client, { _transactionId: transactionId });
      if (!resRead.success) return false;
      const ids = [];
      const documents = [];
      for (let i = 0; i < resRead.data.length; i += 1) {
        ids.push(resRead.data[i]._id);
        const document = resRead.data[i];
        delete document._id;
        delete document._transactionId;
        documents.push(document);
      }
      const replace = async (client, repo, id, payload) => {
        const deleteRes = await repo.delete(client, { _id: id });
        if (!deleteRes.success) return false;
        const createRes = await repo.create(client, [{
          ...payload,
          _id: id,
        }]);
        return createRes.success;
      }
      let updDocs = [];
      for (let i = 0; i < ids.length; i += 1) {
        updDocs.push(
          replace(client, repository, ids[i], documents[i]),
        );
      }
      updDocs = await Promise.all(updDocs);
      let ok = true;
      for (let i = 0; i < updDocs.length; i += 1) {
        if (!updDocs[i]) ok = false;
      }
      return ok;
    }
    let removeFromCollections = [];
    for (let i = 0; i < collections.length; i += 1) {
      removeFromCollections.push(
        removeTransaction(client, collections[i], transactionId)
      );
    }
    removeFromCollections = await Promise.all(removeFromCollections);
    let canRemoveTransaction = true;
    for (let i = 0; i < removeFromCollections.length; i += 1) {
      if (!removeFromCollections[i]) canRemoveTransaction = false;
    }
    if (canRemoveTransaction) {
      const res = await this.repositoryOfCore.delete(client, { transactionId });
      return res.success;
    } else {
      return false;
    }
  }

  async _abortTransaction(client, transactionId) {
    const transaction = await this._getTransaction(client, transactionId);
    if (transaction === null) return false;
    const { collections } = transaction;
    const removeAllInCollection = async (client, collection, transactionId) => {
      const data = collection.split(';');
      const dbName = data[0];
      const collectionName = data[1];
      const repository = new Repository(dbName, collectionName);
      const res = await repository.delete(client, { _transactionId: transactionId });
      return res.success;
    }
    let removeFromCollections = [];
    for (let i = 0; i < collections.length; i += 1) {
      removeFromCollections.push(
        removeAllInCollection(client, collections[i], transactionId)
      );
    }
    removeFromCollections = await Promise.all(removeFromCollections);
    let canRemoveTransaction = true;
    for (let i = 0; i < removeFromCollections.length; i += 1) {
      if (!removeFromCollections[i]) canRemoveTransaction = false;
    }
    if (canRemoveTransaction) {
      const res = await this.repositoryOfCore.delete(client, { transactionId });
      return res.success;
    } else {
      return false;
    }
  }

  async create(client, transactionId, payloads = []) {
    const transaction = await this._getTransaction(client, transactionId);
    if (transaction === null) return false;
    const newPayloads = payloads.map((payload) => {
      payload._transactionId = transactionId;
      return payload;
    });
    const addRes = await this._addCollectionToTransaction(client, transactionId);
    if (!addRes) return false;
    const response = await this.repository.create(client, newPayloads);
    if (!response.success) {
      await this._abortTransaction(client, transactionId);
      return false;
    }
    return true;
  }

  async read(client, transactionId, filter = {}, skip = 0, limit = 0) {
    const transaction = await this._getTransaction(client, transactionId);
    if (transaction === null) return [];
    const response = await this.repository.read(client, filter, skip, limit);
    if (!response.success) return [];
    return response.data;
  }

  async getCount(client, transactionId, filter = {}, skip = 0, limit = 0) {
    const transaction = await this._getTransaction(client, transactionId);
    if (transaction === null) return 0;
    const response = await this.repository.getCount(client, filter, skip, limit);
    if (!response.success) return 0;
    return response.data;
  }

  async update(client, transactionId, filter = {}, payload = {}) {
    const transaction = await this._getTransaction(client, transactionId);
    if (transaction === null) return false;
    const newPayload = { ...payload, _transactionId: transactionId };
    const updRes = await this._addCollectionToTransaction(client, transactionId);
    if (!updRes) return false;
    const response = await this.repository.update(client, filter, newPayload);
    if (!response.success) {
      await this._abortTransaction(client, transactionId);
      return false;
    }
    return true;
  }

  async delete(client, transactionId, filter = {}) {
    const transaction = await this._getTransaction(client, transactionId);
    if (transaction === null) return false;
    const response = await this.repository.delete(client, filter);
    if (!response.success) {
      await this._abortTransaction(client, transactionId);
      return false;
    }
    return true;
  }
}
