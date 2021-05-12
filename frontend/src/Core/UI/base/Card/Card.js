import colors from '../colors';

export default function Card(props) {
  const style={
    width: props.width,
    height: props.height,
    border: `2px solid ${colors.gray}`,
    borderRadius: '4px',
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
