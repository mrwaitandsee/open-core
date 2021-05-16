import colors from '../colors';
import { useState } from 'react';

export default function Input(props) {
  const color = props.color ? props.color : colors.green;
  const [value, setValue] = useState(props.value);
  return (
    <div
      style={{
        width: `calc(${props.width} - 1em)`,
        height: props.height,
      }}
    >
      <input
        onChange={(e) => {
          if (props.onChange) {
            props.onChange(e.target.value);
            setValue(e.target.value)
          }
        }}
        placeholder={props.placeholder}
        type={props.type}
        value={value}
        style={{
          border: `2px solid ${color}`,
          borderRadius: '4px',
          outline: 'none',
          color: color,
          fontFamily: '"AppFont-SemiBold", sans-serif',
          fontSize: '1em',
          width: '100%',
          height: '100%',
          paddingLeft: '0.5em',
          paddingRight: '0.5em',
        }}
      />
    </div>
  );
}
