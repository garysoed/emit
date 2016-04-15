import TestBase from '../test-base';
TestBase.config();

import Mocks from '../../node_modules/gs-tools/src/mock/mocks';
import Recaptcha from '../../node_modules/gs-tools/src/secure/recaptcha';
import { RecaptchaService } from './recaptcha-service';
import TestDispose from '../../node_modules/gs-tools/src/testing/test-dispose';
import WaitUntil from '../../node_modules/gs-tools/src/async/wait-until';


describe('schedule.RecaptchaService', () => {
  let mock$window;
  let mockWaitUntil;
  let service;
  let waitUntilSpy;

  beforeEach(() => {
    mock$window = {};
    mockWaitUntil = Mocks.disposable();
    waitUntilSpy = spyOn(WaitUntil, 'newInstance').and.returnValue(mockWaitUntil);

    service = new RecaptchaService(mock$window);
    TestDispose.add(service);
  });

  it('should initialize correctly', () => {
    expect(WaitUntil.newInstance).toHaveBeenCalledWith(jasmine.any(Function));

    // Not ready yet.
    expect(waitUntilSpy.calls.argsFor(0)[0]()).toEqual(false);

    mock$window['recaptchaReady'] = true;
    expect(waitUntilSpy.calls.argsFor(0)[0]()).toEqual(true);
  });

  describe('render', () => {
    it('should return a promise that is resolved with the recaptcha instance', (done: any) => {
      let mockElement = Mocks.object('Element');
      let mockRecaptcha = Mocks.object('Recaptcha');
      let mockGRecaptcha = Mocks.object('GRecaptcha');
      mock$window['grecaptcha'] = mockGRecaptcha;

      spyOn(Recaptcha, 'newInstance').and.returnValue(mockRecaptcha);

      mockWaitUntil.promise = Promise.resolve();

      service.render(mockElement)
          .then((recaptcha: any) => {
            expect(recaptcha).toEqual(mockRecaptcha);
            expect(Recaptcha.newInstance)
                .toHaveBeenCalledWith(mockGRecaptcha, mockElement, jasmine.any(String));
            done();
          }, done.fail);
    });
  });
});
