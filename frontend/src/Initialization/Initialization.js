import serviceLocator from '../Core/ServiceLocator';
import { screenComponentController, dialogComponentController } from '../Core/UI/ComponentSystemController';
import Model from '../Core/Model';
import { storage } from '../Repository';

// Importing screens
import LoginScreen from '../Container/Screens/LoginScreen';
import RegistrationScreen from '../Container/Screens/RegistrationScreen';
import DashboardScreen from '../Container/Screens/DashboardScreen';


// Importing dialogs


// Model configuration


// Set default values to models
if (storage.hasToken()) {
  serviceLocator.get('global.screen.name').set('DashboardScreen');
} else {
  serviceLocator.get('global.screen.name').set('LoginScreen');
}

import React from 'react';

// Configure screens
screenComponentController.addComponent('LoginScreen', LoginScreen);
screenComponentController.addComponent('RegistrationScreen', RegistrationScreen);
screenComponentController.addComponent('DashboardScreen', DashboardScreen);

// Configure dialogs
