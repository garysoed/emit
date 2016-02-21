import NavigateServiceModule, { NavigateService } from '../navigate/navigate-service';
import ViewType from '../navigate/view-type';


// TODO(gs): Add BaseCtrl.
export class NavButtonCtrl {
  private navigateService_: NavigateService;
  private view_: ViewType;

  constructor(NavigateService: NavigateService) {
    this.navigateService_ = NavigateService;
  }

  get isCurrentView(): boolean {
    return this.navigateService_.currentView === this.view_;
  }

  onClick(): void {
    this.navigateService_.to(this.view);
  }

  get view(): ViewType {
    return this.view_;
  }
  set view(view: ViewType) {
    this.view_ = view;
  }
}

export default angular
    .module('main.NavButton', [
      'ngMaterial',
      NavigateServiceModule.name,
    ])
    .component('emNavButton', {
      bindings: {
        'view': '<',
      },
      controller: NavButtonCtrl,
      templateUrl: 'src/main/nav-button.ng',
      transclude: true,
    });
