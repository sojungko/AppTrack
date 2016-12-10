angular.module('at.addApps', [])

.controller('AddAppsController', function ($scope, $window, $location, Application) {

  $scope.data = {};

  $scope.submitForm = () => {
    $scope.data.userId = $window.localStorage.getItem('app-trak');
    Application.postData($scope.data)
      .then((resp) => {
        $location.path('/');
        return resp;
      });
  };
});
