import colors from '../colors';

export default function Card(props) {
  const style={
    width: props.width,
    height: props.height,
    border: `2px solid ${props.color ? props.color : colors.gray}`,
    borderRadius: '4px',
    ...props.style,
  };
  return (
    <div
      className='row-container align-center'
      style={style}
    >
      { props.content }
    </div>
  );
}
