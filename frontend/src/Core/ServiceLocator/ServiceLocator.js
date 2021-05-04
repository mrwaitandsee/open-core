import { Storage } from './Storage';
import { Container } from './Container';

class ServiceLocator {
  constructor() {
    this.storage = new Storage();
  }
  
  bind(id, item) {
    const container = new Container(item);
    return this.storage.setItem(id, container);
  }

  get(id) {
    return this.storage.getItem(id).get();
  }
}

const serviceLocator = new ServiceLocator();

export default serviceLocator;
