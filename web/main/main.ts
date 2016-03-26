import BaseDisposable from '../../node_modules/gs-tools/src/dispose/base-disposable';
import BemClassModule from '../../node_modules/gs-tools/src/ng/bem-class';
import NavButton from './nav-button';
import OverflowWatcher, { EventType as OverflowWatcherEventType, State as OverflowWatcherState }
    from '../../node_modules/gs-tools/src/ui/overflow-watcher';
import ViewType from '../navigate/view-type';


export class MainCtrl extends BaseDisposable {
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

export default angular
    .module('main.Main', [
      'ngMaterial',
      BemClassModule.name,
      NavButton.name,
    ])
    .component('emMain', {
      bindings: { },
      controller: MainCtrl,
      templateUrl: 'web/main/main.ng',
    });
