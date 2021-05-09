
class ScreenSystemController {
  constructor() {
    this.screens = new Map();
  }

  addScreen(screenName, screenComponent) {
    this.screens.set(screenName, screenComponent);
  }

  getScreen(screenName) {
    return this.screens.get(screenName);
  }

  removeScreen(screenName) {
    this.screens.delete(screenName);
  }
}

const screenSystemController = new ScreenSystemController();

export default screenSystemController;
