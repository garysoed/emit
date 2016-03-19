import AboutViewModule from './about/about-view';
import MainModule from './main/main';
import ScheduleViewModule from './schedule/schedule-view';

angular
    .module('em.App', [
      'ng',
      'ngMaterial',
      'ngRoute',
      AboutViewModule.name,
      MainModule.name,
      ScheduleViewModule.name,
    ])
    .config((
        $mdThemingProvider: angular.material.IThemingProvider,
        $routeProvider: angular.ui.IUrlRouterProvider) => {
      $mdThemingProvider
          .theme('default')
          .primaryPalette('light-blue')
          .accentPalette('lime');
      $routeProvider.otherwise({
        redirectTo: '/about'
      });
    });

angular.bootstrap(document.body, ['em.App'], {strictDi: false});
