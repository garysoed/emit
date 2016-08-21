import AppointmentType from '../model/appointment-type';
import {Enums} from '../../external/gs_tools/src/typescript';
import RouteServiceModule, { RouteService } from '../../external/gs_tools/src/ng/route-service';
import { ViewType } from './view-type';


// TODO(gs): BaseService
export class NavigateService {
  private routeService_: RouteService;

  constructor(gsRouteService: RouteService) {
    this.routeService_ = gsRouteService;
  }

  get currentView(): ViewType {
    let path = this.routeService_.path;

    // Trim off the /
    return Enums.fromLowerCaseString<ViewType>(path.substring(1), ViewType);
  }

  get scheduleViewParams(): { appointmentType?: AppointmentType } {
    let params = this.routeService_.params;
    let scheduleParams = {};
    if (params['appointmentType'] !== undefined) {
      scheduleParams['appointmentType'] =
          Enums.fromLowerCaseString(params['appointmentType'], AppointmentType);
    }

    return scheduleParams;
  }

  to(view: ViewType): void {
    this.routeService_.to(Enums.toLowerCaseString(view, ViewType));
  }

  toSchedule(appointmentType?: AppointmentType): void {
    let path = Enums.toLowerCaseString(ViewType.SCHEDULE, ViewType);
    if (appointmentType !== undefined) {
      this.routeService_.to(
          path,
          {
            'appointmentType': Enums.toLowerCaseString(appointmentType, AppointmentType),
          });
    } else {
      this.routeService_.to(path);
    }
  }
}

export default angular
    .module('navigate.NavigateService', [
      RouteServiceModule.name,
    ])
    .service('NavigateService', NavigateService);
