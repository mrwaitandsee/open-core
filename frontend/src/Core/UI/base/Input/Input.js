import colors from '../colors';
import { useState } from 'react';
import './input.css';

export default function Input(props) {
  const color = props.color ? props.color : colors.gray;
  const textColor = props.textColor ? props.textColor : colors.white;
  const [value, setValue] = useState(props.value || '');
  const val = props.value || '';
  return (
    <input
      className='open-core-input'
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
        color: textColor,
        fontFamily: '"AppFont-SemiBold", sans-serif',
        fontSize: '1em',
        width: props.width,
        height: props.height,
        paddingLeft: '0.5em',
        paddingRight: '0.5em',
        boxShadow: `inset 0px 0px 4px ${colors.black}66`,
        backgroundColor: 'transparent',
      }}
    />
  );
}
