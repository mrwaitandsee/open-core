import { SingletonStrategy } from './SingletonStrategy';
import { PrototypeStrategy } from './PrototypeStrategy';

export class Container {
  constructor(item) {
    this.item = item;
    this.payload = null;
  }

  asSingleton() {
    this.strategy = new SingletonStrategy(this.item);
    this.strategy.execute(this.payload);
    return this;
  }

  asPrototype() {
    this.strategy = new PrototypeStrategy(this.item);
    this.strategy.execute(this.payload);
    return this;
  }

  withPayload(payload) {
    this.payload = payload;
    if (this.strategy) this.strategy.execute(this.payload);
    return this;
  }

  get() {
    if (!this.strategy) throw new Error('Container not configured');
    return this.strategy.get();
  }
}
