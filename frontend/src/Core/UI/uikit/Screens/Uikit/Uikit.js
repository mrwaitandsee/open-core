import Button from '../../../base/Button';
import OutlineButton from '../../../base/OutlineButton';

function ButtonClick() {
  alert('Button');
}

function OutlineButtonClick() {
  alert('OutlineButton');
}

export default (
  <div
    style={{
      width: '100%',
      height: '100vh',
    }}
  >
    <div
      style={{
        position: 'relative',
        left: '2%',
        top: '2%',
        width: '96%',
        height: '96%',
      }}
    >
      <div className='row-container'>
        <div
          className='col-container col-desktop-1'
        >
          <Button
            text='Test text'
            width='100%'
            height='48px'
            onClick={ ButtonClick }
          />

          <div style={{ height: '8px' }}></div>

          <OutlineButton
            text='Test text'
            width='100%'
            height='48px'
            onClick={ OutlineButtonClick }
          />
        </div>
      </div>
    </div>
  </div>
);
