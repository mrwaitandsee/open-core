import BaseDialog from '../../../BaseDialog';
import dialogSystemController from '../../../DialogSystemController';

import Button from '../../../base/Button';
import OutlineButton from '../../../base/OutlineButton';

import colors from '../../../base/colors';

export default (
  <BaseDialog
    onClickByShadow={() => { dialogSystemController.close('uikit') }}
    width='50vw'
    height='50vh'
    title='Test title'
    content={
      <div
        className='row-container align-right row-10'
      >
        <div
          className='col-container align-right '
        >
          <div
            className='row-container align-right'
            style={{
              padding: '1em',
            }}
          >
            <OutlineButton
              text='Close'
              width='96px'
              height='48px'
              color={colors.blue}
              onClick={() => { dialogSystemController.close('uikit') }}
            />
            <div style={{width: '8px'}}></div>
            <Button
              text='Close'
              width='96px'
              height='48px'
              backgroundColor={colors.blue}
              onClick={() => { dialogSystemController.close('uikit') }}
            />
          </div>
        </div>
      </div>
    }
  />
);
