angular.module('at.addApps', [])

.controller('AddAppsController', function ($scope, $window, $location, Application) {

  $scope.data = {};
  $scope.coverLetter = {};

  $scope.submitForm = () => {
    $scope.data.userId = $window.localStorage.getItem('app-trak');
    Application.postData($scope.data)
      .then((resp) => {
        $location.path('/');
        return resp;
      });
  };

  $scope.submit = () => {
    console.log('FILE : ', $scope.coverLetter);
    Application.postFile(file)
      .then((resp) => resp);
  };
});
