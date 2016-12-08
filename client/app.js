angular.module('AppTracker', [
  'Form',
  'SignUp',
  'Services',
  'ngRoute'
])
.config(function($routeProvider, $httpProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'index.html',
      controller: 'FormController'
    })
    .otherwise({
      redirectTo: '/'
    })
})
