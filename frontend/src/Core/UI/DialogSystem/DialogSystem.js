import serviceLocator from '../../ServiceLocator';
import { useState, useEffect } from 'react';
import { dialogComponentController } from '../ComponentSystemController';

export default (props) => {
  const dialogsModel = serviceLocator.get('global.dialog.list');
  const [dialogNames, setDialogNames] = useState(dialogsModel.get());

  useEffect(() => {
    dialogsModel.subscribe(props.name, (name) => setDialogNames([...name]));
    return () => {
      dialogsModel.unsubscribe(props.name);
    }
  }, []);

  const dialogs = [];
  dialogNames.forEach((name) => {
    dialogs.push((
      <div key={`dialog-${name}`}>
        {dialogComponentController.getComponent(name)}
      </div>
    ));
  });

  return (
    <div>
      {dialogs}
    </div>
  )
}
