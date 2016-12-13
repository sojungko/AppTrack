angular.module('at.allApps', [])

.controller('AllAppsController', function ($scope, $window, $location, Application) {
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
    //set bootstrap dropdown in stages card
    $scope.dropdownOption = $scope.stageSelect[index];
  };

  $scope.getJobData = () => {
    Application.getData()
      .then((applications) => {
        //applications response is all applications queried with current logged in user. Users _id was sent down with request headers
        //filter applications by the isOpen boolean for open and completed applications.
        //completed applications are not shows on this page, they are in the completedApps view.
        var filteredApps = applications.filter((app) => {
          return app.isOpen === true;
        })
        $scope.results = filteredApps.reverse();
      })
  };

  $scope.pushToStages = (index) => {
    //requires index when pushing to stage to tie the stage to the correct user _id.
    //backend db call to findByIdAndUpdate requires the _id parameter.
    //pass entire $scope.stageattrs object with all stage information down
    Application.putStageData($scope.results[index]._id, $scope.stageattrs)
      .then(() => {
        //on resolve, clear stageattrs object and make a request for all applications.
        $scope.stageattrs = {};
        $scope.getJobData();
      })
      .then(() => {
        $scope.dropdownOption = 'Select Stages';
      });
  };

  $scope.removeStage = ($index) => {
    //requires index when removing stage to tie the correct user _id when popping stage off the application specific array
    Application.removeStage($scope.results[$index]._id)
      .then(() => {
        //on resolve, clear stageattrs object and make a request for all applications.
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
    $scope.edit.editorEnabled = false;
    //after clicking save edits, set editor to false.
    //pass down index and edit object containing all application edits.
    Application.putEditData($scope.results[$index]._id, edit)
      .then(() => {
        //on resolve, clear edit object and make a request for all applications.
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

  //call getJobData on controller load
  $scope.getJobData();
});
