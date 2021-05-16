import serviceLocator from '../../ServiceLocator';
import { useState, useEffect } from 'react';
import { screenComponentController } from '../ComponentSystemController';

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
      { screenComponentController.getComponent(screenName) }
    </div>
  )
}
