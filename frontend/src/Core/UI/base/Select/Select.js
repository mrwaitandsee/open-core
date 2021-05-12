import colors from '../colors';
import './style.css';
import { useEffect } from 'react';

export default function Select(props) {

  function renderOption(text, onClick, isDefault) {
    if (isDefault) {
      return (
        <option selected='selected' onClick={onClick}>
          {text}
        </option>
      )
    } else {
      return (
        <option onClick={onClick}>
          {text}
        </option>
      )
    }
  }

  function renderOptions() {
    const result = [];
    for (let i = 0; i < props.options.length; i += 1) {
      result.push(renderOption(props.options[i].text, props.options[i].onClick, props.options[i].default ));
    }
    return result;
  }

  useEffect(() => {
    for (let i = 0; i < props.options.length; i += 1) {
      if (props.options[i].default) {
        props.options[i].onClick();
        return;
      }
    }
    props.options[0].onClick();
  }, []);

  const color = props.color ? props.color : colors.green;

  return (
    <div
      style={{
        width: props.width,
        height: props.height,
        cursor: 'pointer',
        border: `2px solid ${color}`,
        color: color,
        borderRadius: '4px',
      }}
    >
      <select
        className='core-select'
        style={{
          color: color,
          fontFamily: '"AppFont-SemiBold", sans-serif',
          fontSize: '1em',
        }}
      >
        { renderOptions() }
      </select>
    </div>
  )
}
