import MainModule from './main/main';

angular
    .module('em.App', [
      'ng',
      'ngMaterial',
      'ngComponentRouter',
      MainModule.name,
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
