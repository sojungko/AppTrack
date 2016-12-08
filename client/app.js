angular.module('at', [
  'Form',
  'SignUp',
  'Services',
  'ngRoute'
])
.config(function($routeProvider, $httpProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'allApps.html',
      controller: 'allAppsController',
      authenticate: false //change to true once auth works
    })
    .when('/addApps', {
      templateUrl: 'addApps.html',
      controller: 'addAppsController',
      authenticate: false //change to true once auth works
    })
    .when('/login', {
      templateUrl: 'signup.html',
      controller: 'AuthController'
    })
    .when('/signup', {
      templateUrl: 'signup.html',
      controller: 'AuthController'
    })
    .otherwise({
      redirectTo: '/'
    })
})
   $httpProvider.interceptors.push('AttachTokens'); // will attach token to the localStorage
})
.factory('AttachTokens', function ($window) {
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('app-track');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})
.run(function ($rootScope, $location, Auth) { // handles the authentication where authentication: true above
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
      $location.path('/login');
    }
  });
});
