angular.module('Services', [])

  .factory('HttpService', function($http){
  const postData = (data) => $http({
    method: 'POST',
    url: '/form',
    data: data
  })
    .then((resp) => resp);

  const getData = () => $http({
    method: 'GET',
    url: '/form'
  })
    .then((resp) => resp);

  const getJob = (role) => $http({
    method: 'GET',
    url: '/form/' + role
  })
    .then((resp) => resp);

  const putStageData = (stage) => {
    // TODO this function needs to be fixed

    // console.log("Stage from within PutStageData HTTP service", stage.stages);
    // return $http.put('/form/' + stage.id, stage.stages)
    // .then(function(res) {
    //   console.log(res)
    //   return res;
    // })
  };

  const putEditData = (editData) => {
    // TODO this function needs to be fixed

    // console.log('THIS IS THE EDIT DATA FROM FACTORY: ', editData);
    // return $http.put('/edit/' + editData.id, editData.edit)
    // .then(function(res) {
    //   return res;
    // })
  };

  return { postData, getData, getJob, putStageData, putEditData }
})
