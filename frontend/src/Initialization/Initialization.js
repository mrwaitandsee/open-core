import serviceLocator from '../Core/ServiceLocator';
import { screenComponentController, dialogComponentController } from '../Core/UI/ComponentSystemController';
import Model from '../Core/Model';

// Importing screens
import LoginScreen from '../Container/Screens/LoginScreen';


// Importing dialogs


// Model configuration


// Set default values to models
serviceLocator.get('global.screen.name').set('LoginScreen');


// Configure screens
screenComponentController.addComponent('LoginScreen', LoginScreen);


// Configure dialogs

