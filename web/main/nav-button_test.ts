import TestBase from '../test-base';
TestBase.config();

import { NavButtonCtrl } from './nav-button';
import ViewType from '../navigate/view-type';


describe('main.NavButtonCtrl', () => {
  let ctrl;
  let mockNavigateService;

  beforeEach(() => {
    mockNavigateService = jasmine.createSpyObj('NavigateService', ['to']);
    ctrl = new NavButtonCtrl(mockNavigateService);
  });

  describe('isCurrentView', () => {
    it('should return true if the current view is the same as the set view', () => {
      let view = ViewType.ABOUT;
      ctrl.view = view;

      mockNavigateService.currentView = view;
      expect(ctrl.isCurrentView).toEqual(true);
    });

    it('should return false if the current view is different from the set view', () => {
      ctrl.view = ViewType.SCHEDULE;

      mockNavigateService.currentView = ViewType.ABOUT;

      expect(ctrl.isCurrentView).toEqual(false);
    });
  });

  describe('onClick', () => {
    it('should navigate to the given view', () => {
      let view = ViewType.ABOUT;
      ctrl.view = view;

      ctrl.onClick();
      expect(mockNavigateService.to).toHaveBeenCalledWith(view);
    });
  });
});
