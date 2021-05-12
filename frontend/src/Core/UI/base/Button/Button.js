import colors from '../colors';

export default function Button(props) {
  const backgroundColor = props.backgroundColor ? props.backgroundColor : colors.green;
  const textColor = props.textColor ? props.textColor : colors.white;
  const style = {
    width: props.width,
    height: props.height,
    backgroundColor: backgroundColor,
    cursor: 'pointer',
    border: `2px solid ${backgroundColor}`,
    color: textColor,
    borderRadius: '4px',
    fontFamily: '"AppFont-SemiBold", sans-serif',
    fontSize: '1em',
  };
  return (
    <div
      className='row-container align-center'
      style={style}
      onClick={props.onClick}
    >
      <div className='col-container align-center unselectable'>
        <div>
          {props.text}
        </div>
      </div>
    </div>
  );
}
