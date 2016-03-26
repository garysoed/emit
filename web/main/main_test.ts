import TestBase from '../test-base';
TestBase.config();

import FakeScope from '../../node_modules/gs-tools/src/ng/fake-scope';
import { MainCtrl } from './main';
import Mocks from '../../node_modules/gs-tools/src/mock/mocks';
import { State as OverflowWatcherState } from '../../node_modules/gs-tools/src/ui/overflow-watcher';
import TestDispose from '../../node_modules/gs-tools/src/testing/test-dispose';


describe('main.MainCtrl', () => {
  let mock$scope;
  let mockToolbar;
  let ctrl;

  beforeEach(() => {
    mock$scope = FakeScope.create();
    mockToolbar = Mocks.object('Toolbar');
    mockToolbar.classList = jasmine.createSpyObj('Toolbar#classList', ['toggle']);

    let mock$element = Mocks.element({
      'md-toolbar': mockToolbar,
      '.sticky': document.createElement('div'),
      'md-content': document.createElement('div'),
    });
    ctrl = new MainCtrl(mock$scope, <any> [mock$element]);
    TestDispose.add(ctrl);
  });

  describe('onWatcherChanged_', () => {
    it('should set the correct classes on the toolbar if uncovered', () => {
      ctrl['watcher_'] = { state: OverflowWatcherState.UNCOVERED };

      spyOn(mock$scope, '$apply');

      ctrl['onWatcherChanged_']();

      expect(ctrl.isSticky).toEqual(false);
      expect(mock$scope.$apply).toHaveBeenCalledWith(jasmine.any(Function));
    });

    it('should set the correct classes on the toolbar if covered', () => {
      ctrl['watcher_'] = { state: OverflowWatcherState.PARTIAL };

      spyOn(mock$scope, '$apply');

      ctrl['onWatcherChanged_']();

      expect(ctrl.isSticky).toEqual(true);
      expect(mock$scope.$apply).toHaveBeenCalledWith(jasmine.any(Function));
    });
  });
});
