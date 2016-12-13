const router = require('express').Router();
const applicationController = require('./applications/applicationController.js');
const userController = require('./users/userController.js');
const email = require('./email/emailModel.js');

//post request endpoint that is initialized in our $http post request in our Angular formController.
// This saves all form inputs to our database which can be viewed via https://mlab.com/

router.post('/api/users/signup', userController.signUp);
router.post('/api/users/signin', userController.signIn);
router.get('/api/users', userController.sendUsername);

router.post('/api/form', applicationController.createApplication);

// get request endpoint for $http get request made in the getData factory function.
router.get('/api/form', applicationController.allPositions);
router.post('/api/form/:id', applicationController.addStage);
router.post('/api/remove/:id', applicationController.removeStage);
router.post('/api/edit/:id', applicationController.editStage);
router.post('/api/delete/:id', applicationController.deleteApp);

// see emailModel.js
router.post('/api/newAppEmail', email.newSend); // called when new application is created and http request sent to /api/newAppEmail
router.post('/api/closedAppEmail', email.closedSend); // called when application is called and http request sent to /api/closedAppEmail
router.post('/api/deleteAppEmail', email.deletedSend); // called when application is deleted and http request sent to /api/deleteAppEmail

module.exports = router;
