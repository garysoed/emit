import NavButton from './nav-button';
import ViewType from '../navigate/view-type';


export class MainCtrl {
  get views(): any {
    return ViewType;
  }
};

export default angular
    .module('main.Main', [
      'ngMaterial',
      NavButton.name,
    ])
    .component('emMain', {
      bindings: { },
      controller: MainCtrl,
      templateUrl: 'web/main/main.ng',
    });
