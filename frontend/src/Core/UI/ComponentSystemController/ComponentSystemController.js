
class ComponentSystemController {
  constructor() {
    this.components = new Map();
  }

  addComponent(name, component) {
    this.components.set(name, component);
  }

  getComponent(name) {
    return this.components.get(name);
  }

  removeComponent(name) {
    this.components.delete(name);
  }
}

const screenComponentController = new ComponentSystemController();
const dialogComponentController = new ComponentSystemController();

export {
  screenComponentController,
  dialogComponentController,
}
