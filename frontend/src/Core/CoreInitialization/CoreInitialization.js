import '../Style/Core.css';
import serviceLocator from '../ServiceLocator';
import screenSystemController from '../UI/ScreenSystemController'
import Model from '../Model';

import uikitScreen from '../UI/uikit/Screens/Uikit';


serviceLocator.bind('global.screen.name', Model).asSingleton();


serviceLocator.get('global.screen.name').set('uikit');
screenSystemController.addScreen('uikit', uikitScreen);
