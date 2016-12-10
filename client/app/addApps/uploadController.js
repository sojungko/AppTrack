angular.module('at.upload', ['ngFileUpload'])

  .controller('UploadController', ['$scope', 'Upload', '$timeout', function ($scope, Upload, $timeout) {
    $scope.$watch('file', function () {
        $scope.upload($scope.file);
    });

    $scope.log = '';

    // upload on file select or drop
    $scope.upload = function (file) {
      console.log('FILE : ', file);
        Upload.upload({
            url: 'api/form/uploads',
            method: 'POST',
            data: { file }
        }).then(function (resp) {
            $timeout(function() {
            $scope.log = 'file: ' +
            resp.config.data.file.name +
            ', Response: ' + JSON.stringify(resp.data) +
            '\n' + $scope.log;
          });
          }, null, function (evt) {
              var progressPercentage = parseInt(100.0 *
              		evt.loaded / evt.total);
              $scope.log = 'progress: ' + progressPercentage +
              	'% ' + evt.config.data.file.name + '\n' +
                $scope.log;
    });
  }
}]);
