angular.module('at.upload', ['ngFileUpload'])

  .controller('UploadController', ['$scope', 'Upload', function ($scope, Upload) {
    $scope.$watch('file', function () {
        $scope.upload($scope.file);
    });

    // upload on file select or drop
    $scope.upload = function (file) {
        Upload.upload({
            url: 'upload/url', //TODO needs to be fixed
            data: { file }
        }).then(function (resp) {
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    };

    // $scope.upload = function (files) {
    //     if (files && files.length) {
    //         for (var i = 0; i < files.length; i++) {
    //           var file = files[i];
    //           if (!file.$error) {
    //             Upload.upload({
    //                 url: '', //TODO
    //                 data: { file }
    //             }).then(function (resp) {
    //                 $timeout(function() {
    //                     $scope.log = 'file: ' +
    //                     resp.config.data.file.name +
    //                     ', Response: ' + JSON.stringify(resp.data) +
    //                     '\n' + $scope.log;
    //                 });
    //             }, null, function (evt) {
    //                 var progressPercentage = parseInt(100.0 *
    //                 		evt.loaded / evt.total);
    //                 $scope.log = 'progress: ' + progressPercentage +
    //                 	'% ' + evt.config.data.file.name + '\n' +
    //                   $scope.log;
    //             });
    //           }
    //         }
    //     }
    // };
}]);
