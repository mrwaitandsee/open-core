import { useState } from 'react';
import serviceLocator from '../../../Core/ServiceLocator';
import Card from '../../../Core/UI/base/Card';
import Input from '../../../Core/UI/base/Input';
import Button from '../../../Core/UI/base/Button';
import OutlineButton from '../../../Core/UI/base/OutlineButton';
import { login, storage } from '../../../Repository';

export default () => {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  
  const inputNicknameOnChange = (text) => setNickname(text);
  const inputPasswordOnChange = (text) => setPassword(text);

  const buttonForgotPasswordOnClick = () => alert('This functionality is not ready yet.');
  const buttonRegistrationOnClick = () => serviceLocator.get('global.screen.name').set('RegistrationScreen');
  const buttonLoginOnClick = async () => {
    if (!nickname) {
      alert('Enter nickname!');
      return;
    }
    if (!password) {
      alert('Enter password!');
      return;
    }
    const loginResponse = await login(nickname, password);
    if (loginResponse.success) {
      alert(loginResponse.message);
      console.log(loginResponse);
      storage.saveToken(loginResponse.accessToken);
    } else {
      alert(loginResponse.message);
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
      }}
      className='col-container align-center'
    >
      <div className='row-container align-center'>
        <div className='col-desktop-6 hide-mobile hide-tablet'>
          <div className='row-container align-center'>
            <Card
              width='100%'
              style={{
                paddingTop: '2em',
                paddingBottom: '2em',
              }}
              content={
                <div
                  style={{
                    width: '80%',
                    height: '100%',
                  }}
                  className='col-container align-center'
                >
                  <div className='row-container align-left'>
                    <Input
                      width='100%'
                      height='3em'
                      placeholder='nickname'
                      type='text'
                      onChange={inputNicknameOnChange}
                      value={nickname}
                    />
                  </div>
                  <div style={{ height: '1em' }}/>
                  <div className='row-container align-left'>
                    <Input
                      width='100%'
                      height='3em'
                      placeholder='password'
                      type='password'
                      onChange={inputPasswordOnChange}
                      value={password}
                    />
                  </div>
                  <div style={{ height: '1em' }}/>
                  <div className='row-container align-left'>
                    <div className='col-desktop-5'>
                      <div className='row-container'>
                        <OutlineButton
                          text='Forgot password'
                          padding='0.75em'
                          onClick={buttonForgotPasswordOnClick}
                        />
                      </div>
                    </div>
                    <div className='col-desktop-7'>
                      <div className='row-container align-right'>
                        <OutlineButton
                          text='Registration'
                          padding='0.75em'
                          onClick={buttonRegistrationOnClick}
                        />
                        <div style={{width: '1em'}}/>
                        <Button
                          text='Login'
                          padding='0.75em'
                          onClick={buttonLoginOnClick}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              }
            />
          </div>
        </div>
        
        <div className='col-mobile-10 col-tablet-8 hide-desktop'>
          <div className='row-container align-center'>
            <Card
              width='100%'
              style={{
                paddingTop: '2em',
                paddingBottom: '2em',
              }}
              content={
                <div
                  style={{
                    width: '80%',
                    height: '100%',
                  }}
                  className='col-container align-center'
                >
                  <div className='row-container align-left'>
                    <Input
                      width='100%'
                      height='3em'
                      placeholder='nickname'
                      type='text'
                      onChange={inputNicknameOnChange}
                      value={nickname}
                    />
                  </div>
                  <div style={{ height: '1em' }}/>
                  <div className='row-container align-left'>
                    <Input
                      width='100%'
                      height='3em'
                      placeholder='password'
                      type='password'
                      onChange={inputPasswordOnChange}
                      value={password}
                    />
                  </div>
                  <div style={{ height: '1em' }}/>
                  <div className='row-container align-left'>
                    <OutlineButton
                      width='100%'
                      height='3em'
                      text='Forgot password'
                      onClick={buttonForgotPasswordOnClick}
                    />
                  </div>
                  <div style={{ height: '1em' }}/>
                  <div className='row-container align-left'>
                    <OutlineButton
                      text='Registration'
                      width='100%'
                      height='3em'
                      onClick={buttonRegistrationOnClick}
                    />
                  </div>
                  <div className='row-container align-left' style={{ width: '100%', height: '100%' }}>
                    <div className='col-container align-right' style={{ width: '100%', height: '100%' }}>
                      <div className='row-container align-right'>
                        <Button
                          text='Login'
                          width='100%'
                          height='3em'
                          onClick={buttonLoginOnClick}
                        />
                      </div>
                    </div>
                  </div>
                  <div style={{ height: '1em' }}/>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
