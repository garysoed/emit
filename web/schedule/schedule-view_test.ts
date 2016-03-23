import TestBase from '../test-base';
TestBase.config();

import { AppointmentType, ScheduleViewCtrl } from './schedule-view';
import FakeScope from '../../node_modules/gs-tools/src/ng/fake-scope';
import Http from '../../node_modules/gs-tools/src/net/http';
import Mocks from '../../node_modules/gs-tools/src/mock/mocks';

describe('schedule.ScheduleViewCtrl', () => {
  let mock$mdDialog;
  let mock$scope;
  let ctrl;

  beforeEach(() => {
    mock$mdDialog = jasmine.createSpyObj('$mdDialog', ['alert', 'show']);
    mock$scope = FakeScope.create();
    ctrl = new ScheduleViewCtrl(mock$mdDialog, mock$scope);
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

    it('should throw error if not handled', () => {
      expect(() => {
        ctrl.getAppointmentTypeString(-1);
      }).toThrowError(/Unhandled appointment type/);
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
});
