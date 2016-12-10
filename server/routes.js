const router = require('express').Router();
const applicationController = require('./applications/applicationController.js');
const userController = require('./users/userController.js');
const email = require('./email/emailModel.js');

//post request endpoint that is initialized in our $http post request in our Angular formController.
// This saves all form inputs to our database which can be viewed via https://mlab.com/

router.post('/api/users/signup', userController.signUp);
router.post('/api/users/signin', userController.signIn);

router.post('/api/form', applicationController.createApplication);
router.post('/api/form/upload', applicationController.uploadFile);

// get request endpoint for $http get request made in the getData factory function.
router.get('/api/form', applicationController.allPositions);

router.post('/api/form/:id', applicationController.addStage);

router.post('/api/edit/:id', applicationController.editStage);

router.post('/api/delete/:id', applicationController.deleteApp);

router.post('/api/newAppEmail', email.newSend);

router.post('/api/closedAppEmail', email.closedSend);

router.post('/api/reminder', email.send);



module.exports = router;
