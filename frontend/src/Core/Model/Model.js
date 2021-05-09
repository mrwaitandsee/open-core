
export default class Model {
  constructor() {
    this.payload = null;
    this.observers = new Map();
  }

  async set(payload) {
    this.payload = payload;
    const promises = Array.from(this.observers.values()).map((callback) => callback(payload));
    await Promise.all(promises);
  }

  get() {
    return this.payload;
  }
  
  subscribe(key, callback) {
    this.observers.set(key, callback);
  }

  unsubscribe(key) {
    this.observers.delete(key);
  }
}
