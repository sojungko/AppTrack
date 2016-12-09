angular.module('at.allApps', [])

.controller('AllAppsController', function ($scope, Application) {
  $scope.role = {};
  $scope.results = {};
  $scope.job = {};
  $scope.stageattrs = {};
  $scope.edit = {};

  $scope.stageSelect = [
    'Select Stage Type',
    'Phone Interview',
    'In-Person Interview(One)',
    'Whiteboarding Session',
    'In-Person Interview(Group)',
    'Full-Day Interview Session',
    'Coding Challenge',
  ];

  $scope.getJobData = () => {
    console.log('AllAppsController.js: getJobData invoked');
    Application.getData()
      .then((forms) => {
        console.log('allAppsController', forms.reverse());
        $scope.results = forms.reverse();
      });
  };

  $scope.getSingleJob = () => {
    Application.getJob($scope.role)
      .then((job) => {
        $scope.job = job;
      });
  };

  $scope.pushToStages = ($index) => {
    Application.putStageData($scope.results[$index]._id, $scope.stageattrs)
      .then(() => {
        $scope.stageattrs = {};
        $scope.getJobData();
      });
  };

  $scope.enableEditor = ($index) => {
    $scope.edit.editorEnabled = true;
    $scope.edit.companyName = $scope.results[$index].companyName;
    $scope.edit.role = $scope.results[$index].role;
    $scope.edit.jobDescription = $scope.results[$index].jobDescription;
    $scope.edit.appliedThrough = $scope.results[$index].appliedThrough;
    $scope.edit.contactName = $scope.results[$index].contactName;
  };

  $scope.save = ($index, edit) => {
    $scope.edit.editorEnabled = false;
    Application.putEditData($scope.results[$index]._id, $scope.edit)
      .then(() => {
        $scope.edit = {};
        $scope.getJobData();
      });
  };

  $scope.getJobData();

});
