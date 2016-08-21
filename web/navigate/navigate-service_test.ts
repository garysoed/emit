import TestBase from '../test-base';
TestBase.config();

import AppointmentType from '../model/appointment-type';
import { NavigateService } from './navigate-service';
import ViewType from './view-type';


describe('navigate.NavigateService', () => {
  let mockRouteService;
  let service;

  beforeEach(() => {
    mockRouteService = jasmine.createSpyObj('RouteService', ['to']);

    service = new NavigateService(mockRouteService);
  });

  describe('get currentView', () => {
    it('should return the correct view type', () => {
      let view = ViewType.ABOUT;
      let path = `/about`;

      mockRouteService.path = path;

      expect(service.currentView).toEqual(view);
    });
  });

  describe('to', () => {
    it('should navigate to the specified view', () => {
      let view = ViewType.ABOUT;

      service.to(view);

      expect(mockRouteService.to).toHaveBeenCalledWith(`about`);
    });
  });

  describe('toSchedule', () => {
    it('should set the appointment type as search param if defined', () => {
      let appointmentType = AppointmentType.TAROT_LONG;
      service.toSchedule(appointmentType);

      expect(mockRouteService.to).toHaveBeenCalledWith('schedule', {
        'appointmentType': 'tarot_long',
      });
    });

    it('should ignore the search param if appointment type is not defined', () => {
      service.toSchedule();
      expect(mockRouteService.to).toHaveBeenCalledWith('schedule');
    });
  });
});
