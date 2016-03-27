import TestBase from '../test-base';
TestBase.config();

import AppointmentType from '../model/appointment-type';
import FakeScope from '../../node_modules/gs-tools/src/ng/fake-scope';
import Http from '../../node_modules/gs-tools/src/net/http';
import Mocks from '../../node_modules/gs-tools/src/mock/mocks';
import { ScheduleViewCtrl } from './schedule-view';

describe('schedule.ScheduleViewCtrl', () => {
  let mock$mdDialog;
  let mock$scope;
  let mockNavigateService;
  let mockScheduleForm;
  let ctrl;

  beforeEach(() => {
    mock$mdDialog = jasmine.createSpyObj('$mdDialog', ['alert', 'show']);
    mock$scope = FakeScope.create();
    mockNavigateService = Mocks.object('NavigateService');
    mockNavigateService.scheduleViewParams = {};
    mockScheduleForm = {};
    mock$scope['scheduleForm'] = mockScheduleForm;
    ctrl = new ScheduleViewCtrl(mock$mdDialog, mock$scope, mockNavigateService);
  });

  it('should default appointment type to the value in navigate service', () => {
    let appointmentType = AppointmentType.COUNSEL;
    mockNavigateService.scheduleViewParams.appointmentType = appointmentType;
    ctrl = new ScheduleViewCtrl(mock$mdDialog, mock$scope, mockNavigateService);

    expect(ctrl.appointmentType).toEqual(String(appointmentType));
  });

  describe('get / set appointmentType', () => {
    it('should return the value set', () => {
      let value = String(AppointmentType.NATAL);
      ctrl.appointmentType = value;
      expect(ctrl.appointmentType).toEqual(value);
    });
  });

  describe('getAppointmentTypeString', () => {
    it('should return the correct value', () => {
      expect(ctrl.getAppointmentTypeString(AppointmentType.NATAL)).toMatch(/Natal Chart/);
    });

    it('should return empty string for null value', () => {
      expect(ctrl.getAppointmentTypeString(null)).toEqual('');
    });

    it('should return empty string for undefined value', () => {
      expect(ctrl.getAppointmentTypeString(undefined)).toEqual('');
    });

    it('should throw error if not handled', () => {
      expect(() => {
        ctrl.getAppointmentTypeString(-1);
      }).toThrowError(/Unhandled appointment type/);
    });
  });

  describe('isInvalid', () => {
    it('should return true if the schedule form is invalid', () => {
      mockScheduleForm.$invalid = true;

      expect(ctrl.isInvalid).toEqual(true);
    });

    it('should return true if the appointment type is not selected', () => {
      mockScheduleForm.$invalid = false;
      expect(ctrl.isInvalid).toEqual(true);
    });

    it('should return false if the schedule form is valid and appointment type is selected',
        () => {
          mockScheduleForm.$invalid = false;
          ctrl.appointmentType = '2';
          expect(ctrl.isInvalid).toEqual(false);
        });
  });

  describe('onClearClick', () => {
    it('should clear all the fields', () => {
      ctrl.appointmentType = String(AppointmentType.NATAL);
      ctrl.name = 'name';
      ctrl.email = 'email';
      ctrl.message = 'message';
      ctrl.onClearClick();

      expect(ctrl.appointmentType).toEqual(null);
      expect(ctrl.name).toEqual('');
      expect(ctrl.email).toEqual('');
      expect(ctrl.message).toEqual('');
    });
  });

  describe('onSubmitClick', () => {
    it('should send the correct request and clear all the fields', (done: any) => {
      let appointmentType = AppointmentType.NATAL;
      let appointmentTypeString = 'appointmentTypeString';
      let name = 'name';
      let email = 'email';
      let message = 'message';

      let mockAlertDialog = Mocks.builder(
          'AlertDialog',
          ['clickOutsideToClose', 'title', 'textContent', 'ok', 'targetEvent']);
      mock$mdDialog.alert.and.returnValue(mockAlertDialog);
      spyOn(mockAlertDialog, 'targetEvent').and.callThrough();

      ctrl.appointmentType = String(appointmentType);
      ctrl.name = name;
      ctrl.email = email;
      ctrl.message = message;

      let mockHttpBuilder = Mocks.builder('Http', ['setFormData']);
      mockHttpBuilder.send = jasmine.createSpy('send').and.returnValue(Promise.resolve());

      spyOn(mockHttpBuilder, 'setFormData').and.callThrough();
      spyOn(Http, 'post').and.returnValue(mockHttpBuilder);

      spyOn(ctrl, 'getAppointmentTypeString').and.returnValue(appointmentTypeString);
      spyOn(ctrl, 'clearFields_');

      let mockEvent = Mocks.object('Event');

      ctrl.onSubmitClick(mockEvent)
          .then(() => {
            expect(Http.post).toHaveBeenCalledWith('/email');
            expect(mockHttpBuilder.setFormData).toHaveBeenCalledWith({
              'from': email,
              'fromName': name,
              'subject': jasmine.stringMatching(appointmentTypeString),
              'content': message,
            });

            expect(ctrl.getAppointmentTypeString).toHaveBeenCalledWith(appointmentType);
            expect(ctrl.clearFields_).toHaveBeenCalledWith();
            expect(mock$mdDialog.show).toHaveBeenCalledWith(mockAlertDialog);
            expect(mockAlertDialog.targetEvent).toHaveBeenCalledWith(mockEvent);
            done();
          }, done.fail);
    });
  });

  describe('requiresBirthTime', () => {
    it('should return true if the appointment type is NATAL', () => {
      ctrl.appointmentType = String(AppointmentType.NATAL);
      expect(ctrl.requiresBirthTime).toEqual(true);
    });

    it('should return false if the appointment type is not NATAL', () => {
      ctrl.appointmentType = String(AppointmentType.COACH);
      expect(ctrl.requiresBirthTime).toEqual(false);
    });
  });
});
