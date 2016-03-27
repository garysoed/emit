import BemClassModule from '../../node_modules/gs-tools/src/ng/bem-class';
import Cache from '../../node_modules/gs-tools/src/data/a-cache';
import Enums from '../../node_modules/gs-tools/src/typescript/enums';
import Http from '../../node_modules/gs-tools/src/net/http';
import ViewType from '../navigate/view-type';

export enum AppointmentType {
  COACH,
  COUNSEL,
  NATAL,
  TAROT_LONG,
  TAROT_SHORT
}

export class ScheduleViewCtrl {
  private $mdDialog_: angular.material.IDialogService;
  private $scope_: angular.IScope;
  private appointmentType_: AppointmentType;
  private birthDate_: Date;
  private email_: string;
  private message_: string;
  private name_: string;

  constructor($mdDialog: angular.material.IDialogService, $scope: angular.IScope) {
    this.$mdDialog_ = $mdDialog;
    this.$scope_ = $scope;
    this.appointmentType_ = null;
    this.birthDate_ = null;
    this.email_ = '';
    this.message_ = '';
    this.name_ = '';
  }

  private clearFields_(): void {
    this.appointmentType_ = null;
    this.email_ = '';
    this.message_ = '';
    this.name_ = '';
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
    return this.appointmentType_ === null ? null : String(this.appointmentType_);
  }
  set appointmentType(appointmentType: string) {
    this.appointmentType_ = Enums
        .fromNumberString<AppointmentType>(appointmentType, AppointmentType);
  }

  get birthDate(): Date {
    return this.birthDate_;
  }
  set birthDate(date: Date) {
    this.birthDate_ = date;
  }

  get email(): string {
    return this.email_;
  }
  set email(email: string) {
    this.email_ = email;
  }

  getAppointmentTypeString(appointmentType: AppointmentType): string {
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
    return this.$scope_['scheduleForm'].$invalid || !this.appointmentType;
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

  onClearClick(): void {
    this.clearFields_();
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
          this.$scope_.$apply(() => undefined);
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
    ])
    .config(($routeProvider: angular.ui.IUrlRouterProvider) => {
      $routeProvider.when(
          `/${Enums.toLowerCaseString(ViewType.SCHEDULE, ViewType)}`,
          {
            controller: ScheduleViewCtrl,
            controllerAs: '$ctrl',
            templateUrl: 'web/schedule/schedule-view.ng',
          });
    });
