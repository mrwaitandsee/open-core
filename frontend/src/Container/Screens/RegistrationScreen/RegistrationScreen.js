import { useState } from 'react';

import serviceLocator from '../../../Core/ServiceLocator';
import Card from '../../../Core/UI/base/Card';
import Input from '../../../Core/UI/base/Input';
import Button from '../../../Core/UI/base/Button';
import OutlineButton from '../../../Core/UI/base/OutlineButton';

import { validateEmail, validateUsername, registration } from '../../../Repository';

export default () => {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');

  const inputNickname = (text) => setNickname(text);
  const inputEmailOnChange = (text) => setEmail(text);
  const buttonLoginOnClick = () => serviceLocator.get('global.screen.name').set('LoginScreen');

  async function buttonRegistrationOnClick() {
    if (!nickname) {
      alert('Nickname must be entered!');
      return;
    }
    const validateEmailResponse = await validateEmail(email);
    if (!validateEmailResponse.success) {
      alert(validateEmailResponse.message);
      return;
    }
    const validateNicknameResponse = await validateUsername(nickname);
    if (!validateNicknameResponse.success) {
      alert(validateNicknameResponse.message);
      return;
    }
    const registrationResponse = await registration(nickname, email);
    if (registrationResponse.success) {
      alert('Account has been successfully created! Check your mailbox.');
      buttonLoginOnClick();
    } else {
      alert(registrationResponse.message);
    }
  }

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
                      onChange={inputNickname}
                      value={nickname}
                    />
                  </div>
                  <div style={{ height: '1em' }}/>
                  <div className='row-container align-left'>
                    <Input
                      width='100%'
                      height='3em'
                      placeholder='email'
                      type='email'
                      onChange={inputEmailOnChange}
                      value={email}
                    />
                  </div>
                  <div style={{ height: '1em' }}/>
                  <div className='row-container align-left'>
                    <div className='col-desktop-12'>
                      <div className='row-container align-right'>
                        <OutlineButton
                          text='Login'
                          padding='0.75em'
                          onClick={buttonLoginOnClick}
                        />
                        <div style={{width: '1em'}}/>
                        <Button
                          text='Registration'
                          padding='0.75em'
                          onClick={buttonRegistrationOnClick}
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
                      onChange={inputNickname}
                      value={nickname}
                    />
                  </div>
                  <div style={{ height: '1em' }} />
                  <div className='row-container align-left'>
                    <Input
                      width='100%'
                      height='3em'
                      placeholder='email'
                      type='email'
                      onChange={inputEmailOnChange}
                      value={email}
                    />
                  </div>
                  <div style={{ height: '1em' }}/>
                  <div className='row-container align-left'>
                    <OutlineButton
                      text='Login'
                      width='100%'
                      height='3em'
                      onClick={buttonLoginOnClick}
                    />
                  </div>
                  <div className='row-container align-left' style={{ width: '100%', height: '100%' }}>
                    <div className='col-container align-right' style={{ width: '100%', height: '100%' }}>
                      <div className='row-container align-right'>
                        <Button
                          text='Registration'
                          width='100%'
                          height='3em'
                          onClick={buttonRegistrationOnClick}
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
  )
}
