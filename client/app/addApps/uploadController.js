//TODO Not being used for Legacy

angular.module('at.upload', [])
  .controller('UploadController', function($scope, $rootScope, Upload) {
    $scope.childCtrl.submit = function(file) {
      Upload.postFile(file)
        .then(function(res) {
        })
      };
  });
