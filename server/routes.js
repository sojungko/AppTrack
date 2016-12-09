const router = require('express').Router();
const positionController = require('./positions/positionController.js');
const userController = require('./users/userController.js');
const email = require('./email/emailModel.js');

//post request endpoint that is initialized in our $http post request in our Angular formController.
// This saves all form inputs to our database which can be viewed via https://mlab.com/

router.post('/api/users/signup', userController.signUp);
router.post('/api/users/signin', userController.signIn);

router.post('/api/form', positionController.newPosition);

// get request endpoint for $http get request made in the getData factory function.
router.get('/api/form', positionController.allPositions);

router.post('/api/form/:id', positionController.addStage);

router.post('/api/edit/:id', positionController.editStage);

router.post('/api/newAppEmail', email.newSend);

router.post('/api/closedAppEmail', email.closedSend);



module.exports = router;
