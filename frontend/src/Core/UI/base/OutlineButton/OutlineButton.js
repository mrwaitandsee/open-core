import colors from '../colors';

export default function OutlineButton(props) {
  const color = props.color ? props.color : colors.green;
  const style = {
    width: props.width,
    height: props.height,
    cursor: 'pointer',
    border: `2px solid ${color}`,
    color: color,
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
