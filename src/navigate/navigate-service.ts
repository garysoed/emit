import ViewType from './view-type';


// TODO(gs): BaseService
export class NavigateService {
  private $location_: angular.ILocationService;

  constructor($location: angular.ILocationService) {
    this.$location_ = $location;
  }

  get currentView(): ViewType {
    let path = this.$location_.path();

    // Trim off the /
    return Number(path.substring(1));
  }

  to(view: ViewType): void {
    this.$location_.path(`${view}`);
  }
}

export default angular
    .module('navigate.NavigateService', [])
    .service('NavigateService', NavigateService);
