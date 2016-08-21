import TestBase from '../test-base';
TestBase.config();

import FakeScope from '../../external/gs_tools/src/ng/fake-scope';
import {RootViewCtrl} from './root-view';
import {Mocks} from '../../external/gs_tools/src/mock';
import {State as OverflowWatcherState} from '../../external/gs_tools/src/ui/overflow-watcher';
import {TestDispose} from '../../external/gs_tools/src/testing';


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
    ctrl = new RootViewCtrl(mock$scope, <any> [mock$element]);
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
