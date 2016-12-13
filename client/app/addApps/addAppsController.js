angular.module('at.addApps', [])

.controller('AddAppsController', function ($scope, $window, $location, Application) {

  $scope.data = {};

  $scope.submitForm = () => {
    //when submitting new application form, get and save header token containing current logged in users _id and username.
    //save token to $scope.data.userId to decrypt on the back to access properties.
    //on application creation, set $scope.data.isOpen default to true. Will set to close when paramaters are met with stages.
    $scope.data.userId = $window.localStorage.getItem('app-trak');
    $scope.data.isOpen = true;
    //pass down entire $scope.data object
    Application.postData($scope.data)
      .then((resp) => {
        $location.path('/');
        return resp;
      });
  };
});
