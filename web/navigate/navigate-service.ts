import ViewType from './view-type';


// TODO(gs): BaseService
export class NavigateService {
  private $location_: angular.ILocationService;

  constructor($location: angular.ILocationService) {
    this.$location_ = $location;
  }

  private getViewForPath_(path: string): ViewType {
    return ViewType[path.toUpperCase()];
  }

  get currentView(): ViewType {
    let path = this.$location_.path();

    // Trim off the /
    return this.getViewForPath_(path.substring(1));
  }

  getPathForView(view: ViewType): string {
    return ViewType[view].toLowerCase();
  }

  to(view: ViewType): void {
    this.$location_.path(`${this.getPathForView(view)}`);
  }
}

export default angular
    .module('navigate.NavigateService', [])
    .service('NavigateService', NavigateService);
