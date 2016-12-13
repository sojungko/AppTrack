angular.module('at.services', [])

.factory('Application', ($http) => {
  const postData = (form) => $http({
    method: 'POST',
    url: '/api/form',
    data: { form },
  })
    .then((postDataResponse) => {
      //postDataResponse contains data posted to database
      //send response data straight down to HTTP request to nodemailer
      //will parse userId on email server and send application created email to appropriate user
      $http({
        method: 'POST',
        url: '/api/newAppEmail',
        data: postDataResponse
      })
    });

  const getData = () => $http({
    method: 'GET',
    url: '/api/form',
  })
    .then(({ data }) => data);

  //use application ID when sending post request to api/form/:id
  //pass down entire stages object with new stage to be pushed
  const putStageData = (id, stages) => $http({
    method: 'POST',
    url: `/api/form/${id}`,
    data: stages,
  })
    .then((stageResponse) => {
      //stage response contains entire application object specific to the edited ID.
      //if the response.data.isOpen boolean is set to false, make an HTTP request
      //to the email server and send a "Closed Application" email to current signed in user.
      if(!stageResponse.data.isOpen){
        $http({
          method: 'POST',
          url: '/api/closedAppEmail',
          data: stageResponse
        })
      }
      //return stageResponse regardless of http call to email server
      return stageResponse;
    });

  //remove stage just requires an ID to be passed down to api/remove/:id
  //no request data sent down. current Application ID is sent down in request.params, received on back
  const removeStage = (id) => $http({
    method: 'POST',
    url: `/api/remove/${id}`
  })
    .then((resp) => resp.data);


  //pass down application ID to the url
  //pass down entire edit object into post data
  const putEditData = (id, edit) => $http({
    method: 'POST',
    url: `/api/edit/${id}`,
    data: { edit },
  })
    .then((resp) => resp.data);


  //response body after application deletion is an object containing all deleted app info.
  //after delete resolves, send an HTTP request to the nodemailer server to send an email
  //to the current sign in user that an application has been deleted. Needs all params in response body.
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

  return { postData, getData, putStageData, removeStage, putEditData, deleteApp };
})

.factory('Auth', ($http, $location, $window) => {

  //signin requires username and password to be passed down in an object.
  const signin = ({ username, password }) => $http({
    method: 'POST',
    url: '/api/users/signin',
    data: { username, password },
  })
    .then((resp) => resp.data);

  //signup requires username, password, and email to be passed down in an object.
  const signup = ({ username, password, email }) => $http({
    method: 'POST',
    url: '/api/users/signup',
    data: { username, password, email },
  })
    .then((resp) => resp.data);

  //boolean check to see if headers were set. if false, then user was not properly authenticated.
  //This check is to show or hide nav buttons based on if user was auth'd or not.
  const isAuth = () => !!$window.localStorage.getItem('app-trak');

  const signout = () => {
    //on signout, remove page headers and redirect to login.
    $window.localStorage.removeItem('app-trak');
    $location.path('/login');
  };

  //function to grab username of currently logged in user and display it in the top nav bar, "Welcome **username**!"
  const getUserName = () => $http({
    method: 'GET',
    url: '/api/users'
  }).then(({ data }) => {
    return data
  });

  return { signin, signup, isAuth, signout, getUserName };
})
