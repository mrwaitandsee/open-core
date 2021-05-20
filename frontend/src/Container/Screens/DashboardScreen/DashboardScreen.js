import { useEffect, useState } from 'react';
import colors from '../../../Core/UI/base/colors';
import { me } from '../../../Repository';
import OutlineButton from '../../../Core/UI/base/OutlineButton';
import { storage } from '../../../Repository';
import serviceLocator from '../../../Core/ServiceLocator';
import Roadmap from '../../../Component/Roadmap';
import Folder from '../../../Component/Folder';
import Controls from '../../../Component/Controls';

export default () => {
  const [nickname, setNickname] = useState('');

  function buttonExitOnClick() {
    storage.clear();
    serviceLocator.get('global.screen.name').set('LoginScreen');
  }

  useEffect(async () => {
    const meResponse = await me();
    if (meResponse.success) {
      console.log(meResponse.message.username);
    }
  }, []);

  function renderFolders() {
    const folders = [];
    for (let i = 1; i <= 9; i += 1) {
      folders.push(
        <Folder
          key={`folder.${i}`}
          name={`folder-${i}`}
        />
      )
    }
    return folders;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: colors.dark,
      }}
    >
      <div style={{
        width: '100%',
        boxShadow: `0px 0px 4px ${colors.black}66`,
        borderRadius: '0px 0px 6px 6px',
        backgroundColor: colors.dark,
      }} className='row-container'>
        <div
          style={{
            width: 'calc(100% - (115px + 0.75em + 0.75em))',
            height: '100%',
          }}
        >
          <Roadmap
            style={{
              marginTop: 'calc(0.75em + 2px)',
              marginLeft: '0.75em',
            }}
          />
        </div>
        <div className='row-container align-right'
          style={{
            width: 'calc(115px + 0.75em + 0.75em)',
            paddingRight: '0.75em',
            paddingTop: '0.75em',
            paddingBottom: '0.75em',
          }}
        >
          <OutlineButton
            padding='0.75em'
            text='Настройки'
          />
        </div>
      </div>
      <div
        className='row-container'
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          height: 'calc(100% - 75px)',
          flexWrap: 'wrap',
          overflowY: 'scroll',
        }} 
      >
        {renderFolders()}
        <Controls />
      </div>
    </div>
  )
}
