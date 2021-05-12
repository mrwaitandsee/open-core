import colors from '../colors';
import './style.css';
import { useEffect } from 'react';

export default function Select(props) {

  function renderOption(text, onClick, index) {
    return (
      <option value={`option-${index}`} onClick={onClick} key={`Option${index}`}>
        {text}
      </option>
    );
  }
  

  function renderOptions() {
    const result = [];
    for (let i = 0; i < props.options.length; i += 1) {
      result.push(renderOption(props.options[i].text, props.options[i].onClick, i));
    }
    return result;
  }

  function getIndexOfDefault() {
    for (let i = 0; i < props.options.length; i += 1) {
      if (props.options[i].default) return i;
    }
    return 0;
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
        defaultValue={`option-${getIndexOfDefault()}`}
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
