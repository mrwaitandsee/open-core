import serviceLocator from '../Core/ServiceLocator';
import { screenComponentController, dialogComponentController } from '../Core/UI/ComponentSystemController';
import Model from '../Core/Model';

// Importing screens
import LoginScreen from '../Container/Screens/LoginScreen';
import RegistrationScreen from '../Container/Screens/RegistrationScreen';


// Importing dialogs


// Model configuration


// Set default values to models
serviceLocator.get('global.screen.name').set('LoginScreen');

import React from 'react';

// Configure screens
screenComponentController.addComponent('LoginScreen', LoginScreen);
screenComponentController.addComponent('RegistrationScreen', RegistrationScreen);


// Configure dialogs

