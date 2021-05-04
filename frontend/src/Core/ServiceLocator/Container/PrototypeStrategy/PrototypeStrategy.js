import { BaseStrategy } from '../BaseStrategy';

export class PrototypeStrategy extends BaseStrategy {
  constructor(item) {
    super(item);
    this.payload = null;
  }

  execute(payload) {
    this.payload = payload;
  }

  get() {
    return new this.item(this.payload);
  }
}
