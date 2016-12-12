angular.module('at.services', [])

.factory('Application', ($http) => {
  const postData = (form) => $http({
    method: 'POST',
    url: '/api/form',
    data: { form },
  })
    .then((postDataResponse) => {
      $http({
        method: 'POST',
        url: '/api/newAppEmail',
        data: postDataResponse
      })
    });
    //next http request to send form down to nodemailer

    const postFile = (file) => $http({
      method: 'POST',
      url: '/api/form/upload',
      data: { file },
    })
      .then((resp) => resp.data);

  const getData = () => $http({
      method: 'GET',
      url: '/api/form',
    })
      .then(({ data }) => data);

  const getJob = (role) => $http({
    method: 'GET',
    url: `/api/form/${role}`,
  })
    .then((resp) => {
      console.log('services.js: ', resp);
    });

  const putStageData = (id, stages) => $http({
    method: 'POST',
    url: `/api/form/${id}`,
    data: stages,
  })
    .then((stageResponse) => {
      if(!stageResponse.data.isOpen){
        $http({
          method: 'POST',
          url: '/api/closedAppEmail',
          data: stageResponse
        })
      }
      return stageResponse;
    });

  const removeStage = (id) => $http({
    method: 'POST',
    url: `/api/remove/${id}`
  })
    .then((resp) => resp.data);

  const putEditData = (id, edit) => $http({
    method: 'POST',
    url: `/api/edit/${id}`,
    data: { edit },
  })
    .then((resp) => resp.data);

  const deleteApp = (id) => $http({
    method: 'POST',
    url: `/api/delete/${id}`
  })
    .then((resp) => {
      $http({
        method: 'POST',
        url: '/api/deleteAppEmail',
        data: resp
      })
    });

  return { postData, getData, getJob, putStageData, removeStage, putEditData, deleteApp };
})

.factory('Auth', ($http, $location, $window) => {
  const signin = ({ username, password }) => $http({
    method: 'POST',
    url: '/api/users/signin',
    data: { username, password },
  })
    .then((resp) => resp.data);

  const signup = ({ username, password, email }) => $http({
    method: 'POST',
    url: '/api/users/signup',
    data: { username, password, email },
  })
    .then((resp) => resp.data);

  const isAuth = () => !!$window.localStorage.getItem('app-trak');

  const signout = () => {
    $window.localStorage.removeItem('app-trak');
    $location.path('/login');
  };

  return { signin, signup, isAuth, signout };
})

//TODO Not being used for Legacy
.factory('Upload', ($http) => {
  const postFile = (file) => $http({
    method: 'POST',
    url: '/api/form/uploads',
    data: file
  })
    .then((resp) => resp.data);

  return postFile;
})
