import React from 'react';
import ReactDOM from 'react-dom';
import './Core/CoreInitialization';
import Application from './Container/Application';

ReactDOM.render(
  <React.StrictMode>
    <Application />
  </React.StrictMode>,
  document.getElementById('root')
);
