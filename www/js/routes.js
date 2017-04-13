angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  
  .state('hOME', {
    url: '/page1',
    templateUrl: 'templates/hOME.html',
    controller: 'hOMECtrl'
  })

  .state('sINGUP', {
    url: '/singup',
    templateUrl: 'templates/sINGUP.html',
    controller: 'sINGUPCtrl'
  })

  .state('cOMPRA', {
    url: '/page2',
    templateUrl: 'templates/cOMPRA.html',
    controller: 'cOMPRACtrl'
  })

  .state('fINDELACOMPRA', {
    url: '/page6',
    templateUrl: 'templates/fINDELACOMPRA.html',
    controller: 'fINDELACOMPRACtrl'
  })

  $urlRouterProvider.otherwise('/page1')
 

});