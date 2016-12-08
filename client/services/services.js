angular.module('at.services', [])

.factory('Application', ($http) => {
  const postData = (form) => $http({
    method: 'POST',
    url: '/api/form',
    data: { form },
  })
    .then(({ data }) => data);

  const getData = () => $http({
    method: 'GET',
    url: '/api/form',
  })
    .then(({ data }) => data);

  const getJob = (role) => $http({
    method: 'GET',
    url: `/api/form/${role}`,
  })
    .then(({ data }) => data);

  const putStageData = (id, stages) => $http({
    method: 'POST',
    url: `/form/${id}`,
    data: { stages },
  })
    .then((resp) => resp.data);

  const putEditData = (id, edit) => $http({
    method: 'POST',
    url: `/edit/${id}`,
    data: { edit },
  })
    .then((resp) => resp.data);

  return { postData, getData, getJob, putStageData, putEditData };
});
