import Card from '../../../Core/UI/base/Card';
import Input from '../../../Core/UI/base/Input';
import Button from '../../../Core/UI/base/Button';
import OutlineButton from '../../../Core/UI/base/OutlineButton';
import colors from '../../../Core/UI/base/colors';

export default (
  <div
    style={{
      width: '100%',
      height: '100vh',
    }}
    className='col-container align-center'
  >
    <div className='row-container align-center'>
      <div className='col-desktop-6'>
        <div className='row-container align-center hide-mobile hide-tablet'>
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
                    placeholder='email'
                    type='email'
                  />
                </div>
                <br/>
                <div className='row-container align-left'>
                  <Input
                    width='100%'
                    height='3em'
                    placeholder='password'
                    type='password'
                  />
                </div>
                <br />
                <div className='row-container align-left'>
                  <div className='col-desktop-5'>
                    <div className='row-container'>
                      <OutlineButton
                        text='Forgot password'
                        padding='0.75em'
                      />
                    </div>
                  </div>
                  <div className='col-desktop-7'>
                    <div className='row-container align-right'>
                      <OutlineButton
                        text='Registration'
                        padding='0.75em'
                      />
                      <div style={{width: '1em'}}/>
                      <Button
                        text='Login'
                        padding='0.75em'
                      />
                    </div>
                  </div>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </div>
  </div>
);
