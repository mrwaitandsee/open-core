import OutlineButton from '../../Core/UI/base/OutlineButton';

export default (props) => {
  const path = props.path || ['mrwaitandsee', 'folderA', 'folderB', 'folderC', 'folderD'];

  function buildRoadmap() {
    const buttons = [];
    const style = { border: 'none', boxShadow: 'none' };
    buttons.push(
      <div key={`roadmap.container.0`} className='row-container'>
        <OutlineButton
          key={`roadmap.container.delimiter.0`}
          text='./'
          style={{
            ...style,
            cursor: 'auto',
            marginRight: '0.25em',
          }}
        />
      </div>
    );
    path.forEach((folderName, index) => {
      const i = index + 1;
      buttons.push(
        <div key={`roadmap.container.${i}`} className='row-container'>
          <OutlineButton
            key={`roadmap.container.button.${i}`}
            text={`${folderName}`}
            style={style}
          />
          <OutlineButton
            key={`roadmap.container.delimiter.${i}`}
            text='/'
            style={{
              ...style,
              cursor: 'auto',
              marginLeft: '0.25em',
              marginRight: '0.25em',
            }}
          />
        </div>
      );
    });
    return buttons;
  }

  return (
    <div className='row-container scroller' style={{
      height: '100%',
      overflowX: 'scroll',
      padding: '0.75em',
      paddingLeft: '0px',
      paddingRight: '0px',
      ...props.style,
      }}
    >
      {buildRoadmap()}
    </div>
  );
}
