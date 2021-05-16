import '../Style/Core.css';
import serviceLocator from '../ServiceLocator';
import { screenComponentController, dialogComponentController } from '../UI/ComponentSystemController';
import Model from '../Model';

// Importing screens
import uikitScreen from '../UI/uikit/Screens/Uikit';


// Importing dialogs
import uikitTestDialog from '../UI/uikit/Dialogs/TestDialog';


// Model configuration
serviceLocator.bind('global.screen.name', Model).asSingleton();
serviceLocator.bind('global.dialog.list', Model).asSingleton();


// Set default values to models
serviceLocator.get('global.screen.name').set('uikit');
serviceLocator.get('global.dialog.list').set([]);


// Configure screens
screenComponentController.addComponent('uikit', uikitScreen);


// Configure dialogs
dialogComponentController.addComponent('uikit', uikitTestDialog);
