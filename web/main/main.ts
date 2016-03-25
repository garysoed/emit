import BaseDisposable from '../../node_modules/gs-tools/src/dispose/base-disposable';
import BemClassModule from '../../node_modules/gs-tools/src/ng/bem-class';
import NavButton from './nav-button';
import OverflowWatcher, { EventType as OverflowWatcherEventType, State as OverflowWatcherState }
    from '../../node_modules/gs-tools/src/ui/overflow-watcher';
import ViewType from '../navigate/view-type';


export class MainCtrl extends BaseDisposable {
  private toolbar_: HTMLElement;
  private watcher_: OverflowWatcher;

  constructor($element: angular.IAugmentedJQuery) {
    super();
    let sticky = $element[0].querySelector('[gs-bem-class="sticky"]');
    this.toolbar_ = <HTMLElement> $element[0].querySelector('md-toolbar');
    this.watcher_ = new OverflowWatcher(
        <HTMLElement> $element[0].querySelector('md-content'),
        <HTMLElement> sticky);

    this.addDisposable(
        this.watcher_.on(OverflowWatcherEventType.CHANGED, this.onWatcherChanged_.bind(this)),
        this.watcher_);
  }

  private onWatcherChanged_(): void {
    let isSticky = this.watcher_.state !== OverflowWatcherState.UNCOVERED;
    this.toolbar_.classList.toggle('stick', isSticky);
    this.toolbar_.classList.toggle('md-whiteframe-z1', isSticky);
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
