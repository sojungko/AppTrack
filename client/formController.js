angular.module('Form', [])
.controller('FormController', function($scope, HttpService){
  $scope.data = {};
  $scope.role = {};
  $scope.results = {};
  $scope.job = {};
  $scope.stageattrs = {};
  $scope.edit = {};
  $scope.stageSelect = ['Select Stage Type', 'Phone Interview', 'In-Person Interview(One)', 'Whiteboarding Session', 'In-Person Interview(Group)', 'Full-Day Interview Session','Coding Challenge']

  $scope.submitForm = function() {

    HttpService.postData({"data": $scope.data})
      .then(function(resp) {
        console.log(resp)
      })
    }

    $scope.getJobData = function() {
      HttpService.getData()
        .then(function(res){
          console.log("this is res", res)
        $scope.results = res.data.reverse();
        })

    }
    $scope.getJobData();

    $scope.getSingleJob = function() {
      console.log($scope.role);

      HttpService.getJob({"role": $scope.role})
        .then(function(resp) {
          console.log(resp)
          $scope.job = resp.data;
        })

    }

    $scope.pushToStages = function($index) {
      console.log("$scope.stageattrs within push to stages", $scope.stageattrs)
      HttpService.putStageData({"id": $scope.results[$index]._id, "stages": $scope.stageattrs})
      .then(function(resp) {
        console.log("this is the resp", resp);
        $scope.stageattrs = {};
        $scope.getJobData();
      })
    }
    $scope.enableEditor = function($index) {
      $scope.edit.editorEnabled = true;
      $scope.edit.companyName = $scope.results[$index].companyName;
      $scope.edit.role = $scope.results[$index].role;
      $scope.edit.jobDescription = $scope.results[$index].jobDescription;
      $scope.edit.appliedThrough = $scope.results[$index].appliedThrough;
      $scope.edit.contactName = $scope.results[$index].contactName;
    }

    $scope.save = function($index, edit){
      $scope.edit.editorEnabled=false;
      HttpService.putEditData({"id": $scope.results[$index]._id, "edit": $scope.edit})
      .then(function(resp) {
        $scope.edit = {};
        $scope.getJobData();
      })
      // console.log('THIS IS THE EDIT+++++++++', edit);
      // $scope.results[$index].companyName = edit.editableCompanyName;
      // $scope.results[$index].role = edit.role;
      // $scope.results[$index].jobDescription = edit.jobDescription;
      // $scope.results[$index].appliedThrough = edit.appliedThrough;
      // $scope.results[$index].contactName = edit.contactName;
      // console.log("SAVE RESULTS++++++++", $scope.edit.editableCompanyName);
    }

  })
.factory('HttpService', function($http){
  let postData = function(data) {

    return $http.post('/form', data)
    .then(function(resp) {
      return resp
    })
  }

  let getData = function() {
    return $http.get('/form')
      .then(function(res){
        return res
      })
  }

  let getJob = function(role) {
  //vvvv this only takes one param here
    return $http.get('/form/' + role)
    .then(function(res){
      return res;
    })
  }

  let putStageData = function(stage) {
    console.log("Stage from within PutStageData HTTP service", stage.stages);
    return $http.put('/form/' + stage.id, stage.stages)
    .then(function(res) {
      console.log(res)
      return res;
    })
  }

  let putEditData = function(editData) {
    console.log('THIS IS THE EDIT DATA FROM FACTORY: ', editData);
    return $http.put('/edit/' + editData.id, editData.edit)
    .then(function(res) {
      return res;
    })
  }


  return {
    postData: postData,
    getData: getData,
    getJob: getJob,
    putStageData: putStageData,
    putEditData: putEditData
  }
})
