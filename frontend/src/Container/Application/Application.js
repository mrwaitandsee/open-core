import ScreenSystem from '../../Core/UI/ScreenSystem';
import DialogSystem from '../../Core/UI/DialogSystem';

export default function Application() {
  return (
    <div className="Application" style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#ffffff',
    }}>
      <ScreenSystem name='ScreenSystem' />
      <DialogSystem name='DialogSystem' />
    </div>
  );
}
