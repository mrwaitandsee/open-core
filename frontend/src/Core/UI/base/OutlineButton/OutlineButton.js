import colors from '../colors';

export default function OutlineButton(props) {
  const color = props.color ? props.color : colors.gray;
  const textColor = props.textColor ? props.textColor : colors.white;
  const style = {
    width: props.width,
    height: props.height,
    cursor: 'pointer',
    border: `2px solid ${color}`,
    color: textColor,
    borderRadius: '4px',
    fontFamily: '"AppFont-SemiBold", sans-serif',
    fontSize: '1em',
    boxShadow: `0px 0px 4px ${colors.black}66`,
    padding: props.padding,
    ...props.style,
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
