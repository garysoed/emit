import TestBase from '../test-base';
TestBase.config();

import { AboutViewCtrl } from './about-view';
import AppointmentType from '../model/appointment-type';

describe('about.AboutViewCtrl', () => {
  let mockNavigateService;
  let ctrl;

  beforeEach(() => {
    mockNavigateService = jasmine.createSpyObj('NavigateService', ['toSchedule']);
    ctrl = new AboutViewCtrl(mockNavigateService);
  });

  describe('onCoachClick', () => {
    it('should navigate with the correct appointment type', () => {
      ctrl.onCoachClick();
      expect(mockNavigateService.toSchedule).toHaveBeenCalledWith(AppointmentType.COACH);
    });
  });

  describe('onCounselClick', () => {
    it('should navigate with the correct appointment type', () => {
      ctrl.onCounselClick();
      expect(mockNavigateService.toSchedule).toHaveBeenCalledWith(AppointmentType.COUNSEL);
    });
  });

  describe('onNatalClick', () => {
    it('should navigate with the correct appointment type', () => {
      ctrl.onNatalClick();
      expect(mockNavigateService.toSchedule).toHaveBeenCalledWith(AppointmentType.NATAL);
    });
  });

  describe('onTarotClick', () => {
    it('should navigate with the correct appointment type', () => {
      ctrl.onTarotClick();
      expect(mockNavigateService.toSchedule).toHaveBeenCalledWith(AppointmentType.TAROT_SHORT);
    });
  });
});
