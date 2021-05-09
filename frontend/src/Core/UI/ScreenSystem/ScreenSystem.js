import serviceLocator from '../../ServiceLocator';
import React, { useState, useEffect } from 'react';
import screenSystemController from '../ScreenSystemController';

export default (props) => {
  const screenModel = serviceLocator.get('global.screen.name');
  const [screenName, setScreenName] = useState(screenModel.get());

  useEffect(() => {
    screenModel.subscribe(props.name, (name) => setScreenName(name));
    return () => {
      screenModel.unsubscribe(props.name);
    }
  }, []);
  
  return (
    <div style={{
      width: '100%',
      height: '100%',
    }}>
      { screenSystemController.getScreen(screenName) }
    </div>
  )
}
