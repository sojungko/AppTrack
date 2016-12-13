angular.module('at.completedApps', [])

.controller('CompletedAppsController', function ($scope, Application) {
  $scope.role = {};
  $scope.results = [];
  $scope.job = {};
  $scope.stageattrs = {};
  $scope.edit = {};

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

  $scope.getJobData = () => {                                     // This works! //
    Application.getData()
      .then((applications) => {
        //applications response is all applications queried with current logged in user. Users _id was sent down with request headers
        //filter applications by the isOpen boolean and show only completed applications.
        var filteredApps = applications.filter((app) => {
          return app.isOpen === false;
        })
        $scope.results = filteredApps.reverse();
      });
  };

  $scope.pushToStages = ($index) => {                            // This works! //
    Application.putStageData($scope.results[$index]._id, $scope.stageattrs)
      .then(() => {
        $scope.stageattrs = {};
        $scope.getJobData();
      });
  };

  $scope.enableEditor = (index) => {
    $scope.edit[index] = {};
    $scope.edit[index].editorEnabled = true;
    $scope.edit.companyName = $scope.results[index].companyName;
    $scope.edit.role = $scope.results[index].role;
    $scope.edit.jobDescription = $scope.results[index].jobDescription;
    $scope.edit.appliedThrough = $scope.results[index].appliedThrough;
    $scope.edit.contactName = $scope.results[index].contactName;
  };

  $scope.save = ($index, edit) => {
    //after clicking save edits, set editor to false.
    //pass down index and edit object containing all application edits.
    $scope.edit.editorEnabled = false;
    Application.putEditData($scope.results[$index]._id, edit)
      .then(() => {
        $scope.edit = {};
        $scope.getJobData();
      });
  };

  $scope.delete = ($index) => {
    //requires index to be passed down to delete the correct application using _id tied to index of current application
    Application.deleteApp($scope.results[$index]._id)
      .then(() => {
        $scope.getJobData();
      })
  };

  //call getJobData on controller load to load all apps based on user
  $scope.getJobData();
});
