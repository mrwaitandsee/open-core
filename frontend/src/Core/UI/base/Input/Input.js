import colors from '../colors';
import { useState } from 'react';

export default function Input(props) {
  const color = props.color ? props.color : colors.green;
  const [value, setValue] = useState(props.value || '');
  const val = props.value || '';
  return (
    <input
      onChange={(e) => {
        if (props.onChange) {
          props.onChange(e.target.value);
          setValue(e.target.value);
        }
      }}
      placeholder={props.placeholder}
      type={props.type}
      value={val}
      style={{
        border: `2px solid ${color}`,
        borderRadius: '4px',
        outline: 'none',
        color: color,
        fontFamily: '"AppFont-SemiBold", sans-serif',
        fontSize: '1em',
        width: props.width,
        height: props.height,
        paddingLeft: '0.5em',
        paddingRight: '0.5em',
      }}
    />
  );
}
