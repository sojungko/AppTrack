angular.module('Services', [])
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
