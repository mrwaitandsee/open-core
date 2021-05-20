import './style.css';
import OutlineButton from '../../Core/UI/base/OutlineButton';
import colors from '../../Core/UI/base/colors';

export default (props) => {
  return (
    <div className='col-desktop-12 col-tablet-12 col-mobile-12'>
      <div
        style={{
          width: '100%',
          height: '202px',
        }}
        className='row-container align-center'
      >

        <div className='col-container align-center'>
          <div className='row-container align-center'>
            <OutlineButton
              padding='0.75em'
              text='Создать папку'
            />
          </div>
          <div style={{ height: '0.75em' }}/>
          <div className='row-container align-center'>
            <OutlineButton
              padding='0.75em'
              text='Добавить приложение'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
