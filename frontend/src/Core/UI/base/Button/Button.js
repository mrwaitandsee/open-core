
export default function Button(props) {
  const backgroundColor = props.backgroundColor ? props.backgroundColor : '#61b75d';
  const textColor = props.textColor ? props.textColor : '#ffffff';
  const style = {
    width: props.width,
    height: props.height,
    backgroundColor: backgroundColor,
    cursor: 'pointer',
    border: `2px solid ${backgroundColor}`,
    color: textColor,
    borderRadius: '8px',
    fontFamily: '"AppFont-Regular", sans-serif',
    fontSize: '1em',
    boxShadow: `0px 2px 4px ${backgroundColor}`,
  };
  return (
    <div
      className='row-container align-center'
      style={ style }
      onClick={props.onClick}
    >
      <div className='col-container align-center unselectable'>
        <div>
          { props.text }
        </div>
      </div>
    </div>
  );
}
