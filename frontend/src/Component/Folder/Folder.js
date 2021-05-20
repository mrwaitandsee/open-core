import './style.css';
import colors from '../../Core/UI/base/colors';

export default (props) => {
  return (
    <div className='col-desktop-2 col-tablet-4 col-mobile-6'>
      <div className='col-container align-center'>
        <div className='row-container align-center'>
          <div style={{cursor: 'pointer'}} className='folder'/>
        </div>
        <div
          className='row-container align-center'
          style={{
            paddingTop: '0.75em',
            fontFamily: '"AppFont-SemiBold", sans-serif',
            fontSize: '1em',
            color: colors.light,
          }}
        >
          <div style={{cursor: 'pointer', textAlign: 'center'}}>
            {props.name}
          </div>
        </div>
      </div>
    </div>
  );
}
