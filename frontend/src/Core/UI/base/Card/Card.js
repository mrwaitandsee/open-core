import colors from '../colors';

export default function Card(props) {
  const color = props.color ? props.color : colors.dark;
  const style={
    width: props.width,
    height: props.height,
    border: `2px solid ${color}`,
    borderRadius: '4px',
    boxShadow: `0px 0px 4px ${colors.black}66`,
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
