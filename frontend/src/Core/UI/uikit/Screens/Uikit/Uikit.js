import Button from '../../../base/Button';
import OutlineButton from '../../../base/OutlineButton';
import Card from '../../../base/Card';
import Select from '../../../base/Select';

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
            onClick={ButtonClick}
          />

          <div style={{ height: '16px' }}></div>

          <OutlineButton
            text='Test text'
            width='100%'
            height='48px'
            onClick={OutlineButtonClick}
          />

          <div style={{ height: '16px' }}></div>

          <Card
            width='100%'
            height='100px'
            content={
              <div
                style={{
                  width: '100%',
                  margin: '8px',
                }}
                className='row-container align-right'
              >
                <OutlineButton
                  text='Test text'
                  width='96px'
                  height='32px'
                  onClick={OutlineButtonClick}
                />
              </div>
            }
          />

          <div style={{ height: '16px' }}></div>

          <Select
            width='100%'
            height='48px'
            options={[
              {
                text: 'One',
                onClick: () => { alert('One'); },
              },
              {
                text: 'Two',
                onClick: () => { alert('Two'); },
                default: true,
              },
              {
                text: 'Three',
                onClick: () => { alert('Three'); }
              },
            ]}
          />
        </div>
      </div>
    </div>
  </div>
);
