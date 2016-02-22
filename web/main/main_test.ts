import TestBase from '../test-base';
TestBase.config();

import DisposableTestSetup from '../../node_modules/gs-tools/src/testing/disposable-test-setup';
import { MainCtrl } from './main';
import Mocks from '../../node_modules/gs-tools/src/mock/mocks';
import { State as OverflowWatcherState } from '../../node_modules/gs-tools/src/ui/overflow-watcher';


describe('main.MainCtrl', () => {
  let mockToolbar;
  let ctrl;

  beforeEach(() => {
    mockToolbar = Mocks.object('Toolbar');
    mockToolbar.classList = jasmine.createSpyObj('Toolbar#classList', ['toggle']);

    let mock$element = Mocks.element({
      'md-toolbar': mockToolbar,
      '.sticky': document.createElement('div'),
      'md-content': document.createElement('div'),
    });
    ctrl = new MainCtrl(<any> [mock$element]);
    DisposableTestSetup.add(ctrl);
  });

  describe('onWatcherChanged_', () => {
    it('should set the correct classes on the toolbar if uncovered', () => {
      ctrl['watcher_'] = { state: OverflowWatcherState.UNCOVERED };

      ctrl['onWatcherChanged_']();

      expect(mockToolbar.classList.toggle).toHaveBeenCalledWith('stick', false);
      expect(mockToolbar.classList.toggle).toHaveBeenCalledWith('md-whiteframe-z1', false);
    });

    it('should set the correct classes on the toolbar if covered', () => {
      ctrl['watcher_'] = { state: OverflowWatcherState.PARTIAL };

      ctrl['onWatcherChanged_']();

      expect(mockToolbar.classList.toggle).toHaveBeenCalledWith('stick', true);
      expect(mockToolbar.classList.toggle).toHaveBeenCalledWith('md-whiteframe-z1', true);
    });
  });
});
