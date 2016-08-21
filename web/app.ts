import {RootViewModule} from './main/root-view';

angular
    .module('em.App', [
      'ng',
      'ngMaterial',
      'ngComponentRouter',
      RootViewModule.name,
    ])
    .value('$routerRootComponent', 'emMain')
    .config((
        $mdThemingProvider: angular.material.IThemingProvider,
        $routeProvider: angular.ui.IUrlRouterProvider) => {
      $mdThemingProvider
          .theme('default')
          .primaryPalette('light-blue')
          .accentPalette('lime');
    });

angular.bootstrap(document.body, ['em.App'], {strictDi: false});
