import AboutViewModule from '../about/about-view';
import {BaseDisposable} from '../../external/gs_tools/src/dispose';
import BemClassModule from '../../external/gs_tools/src/ng/bem-class';
import NavButton from './nav-button';
import OverflowWatcher, { EventType as OverflowWatcherEventType, State as OverflowWatcherState }
    from '../../external/gs_tools/src/ui/overflow-watcher';
import ScheduleViewModule from '../schedule/schedule-view';
import ViewType from '../navigate/view-type';


export class RootViewCtrl extends BaseDisposable {
  private $scope_: angular.IScope;
  private isSticky_: boolean;
  private toolbar_: HTMLElement;
  private watcher_: OverflowWatcher;

  constructor($scope: angular.IScope, $element: angular.IAugmentedJQuery) {
    super();
    this.$scope_ = $scope;
    this.isSticky_ = false;
    this.toolbar_ = <HTMLElement> $element[0].querySelector('md-toolbar');

    let sticky = $element[0].querySelector(`[gs-bem-class="'sticky'"]`);
    this.watcher_ = new OverflowWatcher(
        <HTMLElement> $element[0].querySelector('md-content'),
        <HTMLElement> sticky);

    this.addDisposable(
        this.watcher_.on(OverflowWatcherEventType.CHANGED, this.onWatcherChanged_.bind(this)),
        this.watcher_);
  }

  private onWatcherChanged_(): void {
    this.isSticky_ = this.watcher_.state !== OverflowWatcherState.UNCOVERED;
    this.$scope_.$apply(() => undefined);
  }

  get isSticky(): boolean {
    return this.isSticky_;
  }

  get views(): any {
    return ViewType;
  }
};

export const RootViewModule = angular
    .module('main.RootView', [
      'ngMaterial',
      AboutViewModule.name,
      BemClassModule.name,
      NavButton.name,
      ScheduleViewModule.name,
    ])
    .component('emRootView', {
      $routeConfig: [
        {component: 'emAboutView', name: 'About', path: '/about'},
        {component: 'emScheduleView', name: 'Schedule', path: '/schedule'},
      ],
      bindings: { },
      controller: RootViewCtrl,
      templateUrl: 'web/main/root-view.ng',
    });
