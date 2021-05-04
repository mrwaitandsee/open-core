import { BaseStrategy } from '../BaseStrategy';

export class SingletonStrategy extends BaseStrategy {
  constructor(item) {
    super(item);
    this.payload = null;
  }

  execute(payload) {
    this.payload = payload;
  }

  get() {
    if (!this.item) throw new Error('Singleton dependency not created');
    if (!this.instance) this.instance = new this.item(this.payload);
    return this.instance;
  }
}
