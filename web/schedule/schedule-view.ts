import AppointmentType from '../model/appointment-type';
import BaseComponent from '../../external/gs_tools/src/ng/base-component';
import BemClassModule from '../../external/gs_tools/src/ng/bem-class';
import Cache from '../../external/gs_tools/src/data/a-cache';
import {Enums} from '../../external/gs_tools/src/typescript';
import {Http} from '../../external/gs_tools/src/net';
import NavigateServiceModule, { NavigateService } from '../navigate/navigate-service';
import {RecaptchaEventType, Recaptcha} from '../../external/gs_tools/src/secure';
import RecaptchaServiceModule, { RecaptchaService } from './recaptcha-service';


export class ScheduleViewCtrl extends BaseComponent {
  private $element_: HTMLElement;
  private $mdDialog_: angular.material.IDialogService;
  private appointmentType_: AppointmentType | null;
  private birthDate_: Date | null;
  private email_: string;
  private message_: string;
  private name_: string;
  private recaptchaPromise_: Promise<Recaptcha> | null;
  private recaptchaResponse_: string | null;
  private recaptchaService_: RecaptchaService;

  constructor(
      $element: angular.IAugmentedJQuery,
      $mdDialog: angular.material.IDialogService,
      $scope: angular.IScope,
      NavigateService: NavigateService,
      RecaptchaService: RecaptchaService) {
    super($scope);
    this.$element_ = $element[0];
    this.$mdDialog_ = $mdDialog;
    this.appointmentType_ = NavigateService.scheduleViewParams.appointmentType || null;
    this.birthDate_ = null;
    this.email_ = '';
    this.message_ = '';
    this.name_ = '';
    this.recaptchaPromise_ = null;
    this.recaptchaResponse_ = null;
    this.recaptchaService_ = RecaptchaService;
  }

  private clearFields_(): void {
    this.appointmentType_ = null;
    this.email_ = '';
    this.message_ = '';
    this.name_ = '';
  }

  private onNewResponse_(recaptcha: Recaptcha): void {
    this.recaptchaResponse_ = recaptcha.response;
    this.$scope.$apply(() => undefined);
  }

  $onInit(): void {
    this.recaptchaPromise_ = this.recaptchaService_
        .render(<HTMLElement> this.$element_.querySelector(`[gs-bem-class="'recaptcha'"]`))
        .then((recaptcha: Recaptcha) => {
          this.addDisposable(recaptcha);
          this.addDisposable(recaptcha.on(
              RecaptchaEventType.NEW_RESPONSE, this.onNewResponse_.bind(this, recaptcha)));
          return recaptcha;
        });
  }

  @Cache()
  get appointmentTypes(): AppointmentType[] {
    return [
      AppointmentType.NATAL,
      AppointmentType.TAROT_SHORT,
      AppointmentType.TAROT_LONG,
      AppointmentType.COUNSEL,
      AppointmentType.COACH,
    ];
  }

  get appointmentType(): string {
    return this.appointmentType_ === null ? '' : String(this.appointmentType_);
  }
  set appointmentType(appointmentType: string) {
    this.appointmentType_ = Enums
        .fromNumberString<AppointmentType>(appointmentType, AppointmentType);
  }

  get birthDate(): Date | null {
    return this.birthDate_;
  }
  set birthDate(date: Date | null) {
    this.birthDate_ = date;
  }

  get email(): string {
    return this.email_;
  }
  set email(email: string) {
    this.email_ = email;
  }

  getAppointmentTypeString(appointmentType: AppointmentType | null): string {
    switch (appointmentType) {
      case null:
      case undefined:
        return '';
      case AppointmentType.COACH:
        return 'Life coaching';
      case AppointmentType.COUNSEL:
        return 'Spiritual counseling - $30 for 30 minutes';
      case AppointmentType.NATAL:
        return 'Astrological Natal Chart - $50 for 1 hour';
      case AppointmentType.TAROT_LONG:
        return 'Tarot Reading - $60 for 1 hour';
      case AppointmentType.TAROT_SHORT:
        return 'Tarot Reading - $35 for 30 minutes';
      default:
        throw Error(`Unhandled appointment type: ${appointmentType}`);
    }
  }

  get isInvalid(): boolean {
    return this.$scope['scheduleForm'].$invalid ||
        !this.appointmentType ||
        this.recaptchaResponse_ === null;
  }

  get message(): string {
    return this.message_;
  }
  set message(message: string) {
    this.message_ = message;
  }

  get name(): string {
    return this.name_;
  }
  set name(name: string) {
    this.name_ = name;
  }

  onClearClick(): Promise<void> {
    this.clearFields_();
    this.recaptchaResponse_ = null;
    if (this.recaptchaPromise_ !== null) {
      return this.recaptchaPromise_.then((recaptcha: Recaptcha) => {
        recaptcha.reset();
      });
    } else {
      throw new Error('Ctrl not initialized');
    }
  }

  onSubmitClick($event: MouseEvent): Promise<any> {
    let appointmentTypeString = this.getAppointmentTypeString(this.appointmentType_);
    return Http
        .post('/email')
        .setFormData({
          'from': this.email,
          'fromName': this.name,
          'subject': `[SCHEDULE] ${this.name} - ${appointmentTypeString}`,
          'content': this.message,
          'recaptcha': this.recaptchaResponse_,
        })
        .send()
        .then(() => {
          this.clearFields_();
          this.$mdDialog_.show(
              this.$mdDialog_.alert()
                  .clickOutsideToClose(true)
                  .title('Thank you for scheduling')
                  .textContent('We will contact you within one business day')
                  .ok('OK')
                  .targetEvent($event));
          this.$scope.$apply(() => undefined);
        });
  }

  get requiresBirthTime(): boolean {
    return this.appointmentType_ === AppointmentType.NATAL;
  }
}

export default angular
    .module('schedule.ScheduleView', [
      'ngRoute',
      BemClassModule.name,
      NavigateServiceModule.name,
      RecaptchaServiceModule.name,
    ])
    .component('emScheduleView', {
      bindings: { },
      controller: ScheduleViewCtrl,
      templateUrl: 'web/schedule/schedule-view.ng',
    });
