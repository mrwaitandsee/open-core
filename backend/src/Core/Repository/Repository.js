import MongoRepository from './MongoRepository.js';

export default class Repository {
  constructor(databaseName, collectionName) {
    this.crud = new MongoRepository(databaseName, collectionName);
	}

	static strToId(id) {
    return MongoRepository.strToId(id);
  }

	static async getClient(dbUri) {
		return MongoRepository.getClient(dbUri);
	}

	static disposeClient(client) {
    MongoRepository.disposeClient(client);
  }

  async create(client, payloads = []) {
		return this.crud.create(client, payloads);
	}

	async getCount(client, filter = {}, skip = 0, limit = 0) {
		return this.crud.getCount(client, filter, skip, limit);
	}

  async read(client, filter = {}, skip = 0, limit = 0) {
		return this.crud.read(client, filter, skip, limit);
	}

  async update(client, filter = {}, payload = {}) {
		return this.crud.update(client, filter, payload);
	}

  async delete(client, filter = {}) {
		return this.crud.delete(client, filter);
	}
}
