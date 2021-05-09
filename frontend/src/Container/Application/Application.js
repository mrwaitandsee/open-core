import serviceLocator from '../../Core/ServiceLocator';
import ScreenSystem from '../../Core/UI/ScreenSystem';
import screenSystemController from '../../Core/UI/ScreenSystemController';

export default function Application() {
  return (
    <div className="Application" style={{
      width: '100%',
      height: '100%',
    }}>
      <ScreenSystem name='ScreenSystem' />
    </div>
  );
}
