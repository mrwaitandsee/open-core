import ScreenSystem from '../../Core/UI/ScreenSystem';
import DialogSystem from '../../Core/UI/DialogSystem';

export default function Application() {
  return (
    <div className="Application" style={{
      position: 'absolute',
      top: '0px',
      bottom: '0px',
      left: '0px',
      right: '0px',
      width: '100%',
      height: '100%', 
    }}>
      <ScreenSystem name='ScreenSystem' />
      <DialogSystem name='DialogSystem' />
    </div>
  );
}
