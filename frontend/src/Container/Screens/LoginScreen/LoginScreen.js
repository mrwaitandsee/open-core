import { useState } from 'react';
import serviceLocator from '../../../Core/ServiceLocator';
import Card from '../../../Core/UI/base/Card';
import Input from '../../../Core/UI/base/Input';
import Button from '../../../Core/UI/base/Button';
import OutlineButton from '../../../Core/UI/base/OutlineButton';
import { login, storage } from '../../../Repository';
import colors from '../../../Core/UI/base/colors';

export default () => {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  
  const inputNicknameOnChange = (text) => setNickname(text);
  const inputPasswordOnChange = (text) => setPassword(text);

  const buttonForgotPasswordOnClick = () => alert('Эта функциональность ещё не готова.');
  const buttonRegistrationOnClick = () => serviceLocator.get('global.screen.name').set('RegistrationScreen');
  const buttonLoginOnClick = async () => {
    if (!nickname) {
      alert('Введите имя пользователя.');
      return;
    }
    if (!password) {
      alert('Введите пароль.');
      return;
    }
    const loginResponse = await login(nickname, password);
    if (loginResponse.success) {
      storage.saveToken(loginResponse.accessToken);
      serviceLocator.get('global.screen.name').set('DashboardScreen');
    } else {
      alert(loginResponse.message);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      buttonLoginOnClick();
    }
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        backgroundColor: colors.dark,
      }}
      className='col-container align-center'
      onKeyDown={handleKeyDown}
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
                      placeholder='Имя пользователя'
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
                      placeholder='Пароль'
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
                          text='Забыли пароль?'
                          padding='0.75em'
                          onClick={buttonForgotPasswordOnClick}
                        />
                      </div>
                    </div>
                    <div className='col-desktop-7'>
                      <div className='row-container align-right'>
                        <OutlineButton
                          text='Регистрация'
                          padding='0.75em'
                          onClick={buttonRegistrationOnClick}
                        />
                        <div style={{width: '1em'}}/>
                        <Button
                          text='Войти'
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
                      placeholder='Имя пользователя'
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
                      placeholder='Пароль'
                      type='password'
                      onChange={inputPasswordOnChange}
                      value={password}
                    />
                  </div>
                  <div style={{ height: '1em' }}/>
                  <div className='row-container align-left'>
                    <Button
                      text='Войти'
                      width='100%'
                      height='3em'
                      onClick={buttonLoginOnClick}
                    />
                  </div>
                  <div style={{ height: '2em' }}/>
                  <div className='row-container align-left'>
                    <OutlineButton
                      text='Регистрация'
                      width='100%'
                      height='3em'
                      onClick={buttonRegistrationOnClick}
                    />
                  </div>
                  <div style={{ height: '1em' }}/>
                  <div className='row-container align-left'>
                    <OutlineButton
                      width='100%'
                      height='3em'
                      text='Забыли пароль?'
                      onClick={buttonForgotPasswordOnClick}
                    />
                  </div>
                  
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
