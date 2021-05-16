
export default function BaseDialog(props) {
  return (
    <div
      style={{
        position: 'absolute',
        left: '0px',
        top: '0px',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
      }}
      onClick={() => { props.onClickByShadow() }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
        }}
        className='row-container align-center'
      >
        <div
          className='col-container align-center'
        >
          <div
            style={{
              left: '0px',
              width: props.width,
              height: props.height,
              backgroundColor: '#ffffff',
              borderRadius: '4px',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
              }}
            >
              <div
                className='row-container align-left row-2'
              >
                <div className='col-container align-center'>
                  <div
                    style={{
                      fontFamily: '"AppFont-SemiBold", sans-serif',
                      fontSize: '1.25em',
                      marginLeft: '1em',
                      marginRight: '1em',
                    }}
                  >
                    {props.title}
                  </div>
                </div>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  paddingBottom: '-4em',
                }}
              >
                {props.content}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
