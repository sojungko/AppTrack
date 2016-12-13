angular.module('at.allApps', [])

.controller('AllAppsController', function ($scope, $window, Application) {
  $scope.role = {};
  $scope.results = [];
  $scope.job = {};
  $scope.stageattrs = {};
  $scope.edit = {};
  $scope.dropdownOption = 'Select Stages'

  // Dropdown menu for Add Stage Card //

  $scope.stageSelect = [
    'Phone Interview',
    'In-Person Interview(One)',
    'Whiteboarding Session',
    'In-Person Interview(Group)',
    'Full-Day Interview Session',
    'Coding Challenge',
    'Application Complete'
  ];

  $scope.setDropDown = (index) => {
    console.log('index:', index)
    console.log($scope.stageSelect[index])
    $scope.dropdownOption = $scope.stageSelect[index];
  };

  $scope.getJobData = () => {
    const token = $window.localStorage.getItem('app-trak');
    Application.getData(token)
      .then((applications) => {
        var filteredApps = applications.filter((app) => {
          return app.isOpen === true;
        })
        $scope.results = filteredApps.reverse();
      });
  };

  $scope.pushToStages = (index) => {
    console.log(index)
    console.log('setting a new interview type: ', $scope.stageSelect[index]);
    $scope.stageattrs.interviewType = $scope.stageSelect[index]
    console.log($scope.results[index]._id, $scope.stageattrs.interviewType);
    Application.putStageData($scope.results[index]._id, $scope.stageattrs)
      .then(() => {
        $scope.stageattrs = {};
        $scope.getJobData();
      });
  };

  $scope.removeStage = ($index) => {
    Application.removeStage($scope.results[$index]._id)
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

  $scope.delete = ($index) => {
    Application.deleteApp($scope.results[$index]._id)
      .then(() => {
        $scope.getJobData();
      })
  };

  $scope.getJobData();
});
