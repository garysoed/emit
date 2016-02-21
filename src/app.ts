import Main from './main/main';

angular
    .module('em.App', [
      'ng',
      'ngMaterial',
      'ngRoute',
      Main.name,
    ])
    .config(($mdThemingProvider: angular.material.IThemingProvider) => {
      $mdThemingProvider
          .theme('default')
          .primaryPalette('light-blue')
          .accentPalette('yellow');
    });

angular.bootstrap(document.body, ['em.App'], {strictDi: false});
