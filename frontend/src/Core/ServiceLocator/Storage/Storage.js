
export class Storage {
  constructor() {
    this.storage = new Map();
  }

  setItem(id, item) {
    this.storage.set(id, item);
    return this.getItem(id);
  }

  getItem(id) {
    return this.storage.get(id);
  }
}
