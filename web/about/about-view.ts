import AppointmentType from '../model/appointment-type';
import BemClassModule from '../../node_modules/gs-tools/src/ng/bem-class';
import Enums from '../../node_modules/gs-tools/src/typescript/enums';
import NavigateServiceModule, { NavigateService } from '../navigate/navigate-service';
import ViewType from '../navigate/view-type';

export class AboutViewCtrl {
  private navigateService_: NavigateService;

  constructor(NavigateService: NavigateService) {
    this.navigateService_ = NavigateService;
  }

  onCoachClick(): void {
    this.navigateService_.toSchedule(AppointmentType.COACH);
  }

  onCounselClick(): void {
    this.navigateService_.toSchedule(AppointmentType.COUNSEL);
  }

  onNatalClick(): void {
    this.navigateService_.toSchedule(AppointmentType.NATAL);
  }

  onTarotClick(): void {
    this.navigateService_.toSchedule(AppointmentType.TAROT_SHORT);
  }
};

export default angular
    .module('about.AboutView', [
      'ngRoute',
      BemClassModule.name,
      NavigateServiceModule.name,
    ])
    .component('emAboutView', {
      bindings: { },
      controller: AboutViewCtrl,
      templateUrl: 'web/about/about-view.ng'
    });
