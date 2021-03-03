import { MongoClient } from 'mongodb';

export default class MongoRepository {
  constructor(databaseName, collectionName) {
    this.databaseName = databaseName;
    this.collectionName = collectionName;
  }

  static async getClient(dbUri) {
    return MongoClient.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).catch((error) => { console.error(error); });
  }

  static disposeClient(client) {
    client.close();
  }

  async create(client, payloads = []) {
    if (!client) return { success: false, message: 'No client object.' };
    let result = { success: null, message: null };
    try {
      const { databaseName, collectionName } = this;
      const db = client.db(databaseName);
      const collection = db.collection(collectionName);
      await collection.insertMany(payloads);
      result = {
        success: true,
        message: 'The "create" operation was successful.',
      };
    } catch (error) {
      result = { success: false, message: error };
    }
    return result;
  }

  async read(client, filter = {}, skip = 0, limit = 0) {
    if (!client) return {
      success: false,
      message: 'No client object.',
      data: null,
    };
    let result = { success: null, message: null, data: null };
    try {
      const { databaseName, collectionName } = this;
      const db = client.db(databaseName);
      const collection = db.collection(collectionName);
      result = {
        success: true,
        message: 'The "read" operation was successful.',
        data: await collection.find(filter).skip(skip).limit(limit).toArray(),
      };
    } catch (error) {
      result = {
        success: false,
        message: error,
        data: null,
      };
    }
    return result;
  }

  async getCount(client, filter = {}, skip = 0, limit = 0) {
    if (!client) return {
      success: false,
      message: 'No client object.',
      data: null
    };
    let result = { success: null, message: null, data: null };
    try {
      const { databaseName, collectionName } = this;
      const db = client.db(databaseName);
      const collection = db.collection(collectionName);
      result = {
        success: true,
        message: 'The "getCount" operation was successful.',
        data: await collection.find(filter).skip(skip).limit(limit).count(),
      };
    } catch (error) {
      result = {
        success: false,
        message: error,
        data: null,
      };
    }
    return result;
  }

  async update(client, filter = {}, payload = {}) {
    if (!client) return { success: false, message: 'No client object.' };
    let result = { success: null, message: null };
    try {
      const { databaseName, collectionName } = this;
      const db = client.db(databaseName);
      const collection = db.collection(collectionName);
      await collection.updateMany(filter, { $set: payload });
      result = {
        success: true,
        message: 'The "update" operation was successful.'
      };
    } catch (error) {
      result = { success: false, message: error };
    }
    return result;
  }

  async delete(client, filter = {}) {
    if (!client) return { success: false, message: 'No client object.' };
    let result = { success: null, message: null };
    try {
      const { databaseName, collectionName } = this;
      const db = client.db(databaseName);
      const collection = db.collection(collectionName);
      await collection.deleteMany(filter);
      result = {
        success: true,
        message: 'The "delete" operation was successful.'
      };
    } catch (error) {
      result = { success: false, message: error };
    }
    return result;
  }
}
