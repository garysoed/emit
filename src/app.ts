angular
    .module('em.App', [
      'ngMaterial',
      'ngRoute'
    ]);

angular.bootstrap(document.body, ['em.App'], {strictDi: false});
