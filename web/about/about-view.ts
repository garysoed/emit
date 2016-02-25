import Enums from '../../node_modules/gs-tools/src/typescript/enums';
import ViewType from '../navigate/view-type';

export class AboutViewCtrl {

};

export default angular
    .module('about.AboutView', ['ngRoute'])
    .config(($routeProvider: angular.ui.IUrlRouterProvider) => {
      $routeProvider.when(
          `/${Enums.toLowerCaseString(ViewType.ABOUT, ViewType)}`,
          {
            controller: AboutViewCtrl,
            controllerAs: '$ctrl',
            templateUrl: 'web/about/about-view.ng',
          });
    });
