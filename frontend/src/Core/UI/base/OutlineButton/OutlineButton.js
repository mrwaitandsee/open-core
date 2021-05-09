
export default function OutlineButton(props) {
  const color = props.color ? props.color : '#61b75d';
  const style = {
    width: props.width,
    height: props.height,
    cursor: 'pointer',
    border: `2px solid ${color}`,
    color: color,
    borderRadius: '8px',
    fontFamily: '"AppFont-Regular", sans-serif',
    fontSize: '1em',
  };
  return (
    <div
      className='row-container align-center'
      style={ style }
      onClick={ props.onClick }
    >
      <div className='col-container align-center unselectable'>
        <div>
          { props.text }
        </div>
      </div>
    </div>
  );
}
