import serviceLocator from '../../ServiceLocator';

class DialogSystemController {
  open(name) {
    const dialogsModel = serviceLocator.get('global.dialog.list');
    const dialogs = dialogsModel.get();

    if (dialogs.indexOf(name) > -1) {
      return;
    } else {
      dialogs.push(name);
      dialogsModel.set(dialogs);
    }
  }

  close(name) {
    const dialogsModel = serviceLocator.get('global.dialog.list');
    const dialogs = dialogsModel.get();

    if (dialogs.indexOf(name) > -1) {
      dialogsModel.set(dialogs.filter(e => e !== name));
    }
  }
}

const dialogSystemController = new DialogSystemController();

export default dialogSystemController;
