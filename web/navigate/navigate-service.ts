import Enums from '../../node_modules/gs-tools/src/typescript/enums';
import { ViewType } from './view-type';


// TODO(gs): BaseService
export class NavigateService {
  private $location_: angular.ILocationService;

  constructor($location: angular.ILocationService) {
    this.$location_ = $location;
  }

  get currentView(): ViewType {
    let path = this.$location_.path();

    // Trim off the /
    return Enums.fromLowerCaseString<ViewType>(path.substring(1), ViewType);
  }

  to(view: ViewType): void {
    this.$location_.path(Enums.toLowerCaseString(view, ViewType));
  }
}

export default angular
    .module('navigate.NavigateService', [])
    .service('NavigateService', NavigateService);
