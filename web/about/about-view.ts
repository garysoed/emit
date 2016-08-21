import AppointmentType from '../model/appointment-type';
import BemClassModule from '../../external/gs_tools/src/ng/bem-class';
import NavigateServiceModule, { NavigateService } from '../navigate/navigate-service';


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
      templateUrl: 'web/about/about-view.ng',
    });
