import {BaseDisposable} from '../../external/gs_tools/src/dispose';
import {Recaptcha} from '../../external/gs_tools/src/secure';
import WaitUntil from '../../external/gs_tools/src/async/wait-until';

const SITEKEY = '6LffXR0TAAAAAF_UhiUh0WPD4-_HXTgCPQscIL07';


export class RecaptchaService extends BaseDisposable {
  private $window_: Window;
  private waitUntil_: WaitUntil;

  constructor($window: Window) {
    super();
    this.$window_ = $window;
    this.waitUntil_ = WaitUntil.newInstance(this.checkReady_.bind(this));

    this.addDisposable(this.waitUntil_);
  }

  checkReady_(): boolean {
    return this.$window_['recaptchaReady'] === true;
  }

  render(element: HTMLElement): Promise<Recaptcha> {
    return this.waitUntil_.promise
        .then(() => {
          return Recaptcha.newInstance(this.$window_['grecaptcha'], element, SITEKEY);
        });
  }
}


export default angular
    .module('schedule.RecaptchaService', [])
    .service('RecaptchaService', RecaptchaService);
