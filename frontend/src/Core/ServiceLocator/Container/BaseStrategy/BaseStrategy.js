
export class BaseStrategy {
  constructor(item) {
    this.item = item;
  }

  execute() {
    throw new Error('NotImplementedException');
  }

  get() {
    throw new Error('NotImplementedException');
  }
}