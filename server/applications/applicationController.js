const Q = require('q');
const applicationModel = require('./applicationModel.js');
const jwt = require('jwt-simple');
const fs = require('fs');
const path = require('path');

const findApplication = Q.nbind(applicationModel.findOne, applicationModel);
const createApplication = Q.nbind(applicationModel.create, applicationModel);
const findAllApplication = Q.nbind(applicationModel.find, applicationModel);

module.exports = {
  allPositions(req, res) {
    //when calling all positions, req.headers contains access token after successful auth.
    //use jwt to decode the token string to access the users _id, username, and email.
    //use current logged in user's _id to send query for all applications tied to that user
    var decrypted = jwt.decode(req.headers['x-access-token'], 'apptrak');
    findAllApplication({userId: decrypted._id})
      .then((positions) => {
        res.json(positions);
      })
      .fail((err) => {
        console.log("ERROR in retreiving all positions, server/positions/positionController : ", err);
      });
  },

  createApplication({ body: { form } }, res) {
    //req.body form object contains user information passed down in token format, use jwt to decode token and access users _id
    //add users _id to the form object before querying database to create application, will tie current user _id to the application
    var userInfo = jwt.decode(form.userId, 'apptrak');
    form.userId = userInfo._id;
    createApplication(form)
      .then((newApplication) => {
        res.send(newApplication);
      })
      .fail((err) => {
        console.log("ERROR in creating position, server/positions/positionController : ", err);
      });
  },

  addStage(req, res) {
    //when adding application stages, check if req.body interviewType is set to 'Application Complete'
    //default setting for application isOpen should be TRUE on createApplication, remains true if if statement never executes.
    //When interviewType is equal to 'Application Complete', set isOpen to false and run the update query.
    //applications will be filtered on the front end based on isOpen setting.
    var isOpen = true;
    if(req.body.interviewType === 'Application Complete'){
      isOpen = false;
    }
    //query below is in MongoDB query format
  	applicationModel.findByIdAndUpdate(req.params.id, {
	    $push: {
	      "stages": req.body
      },
      $set: {
        "isOpen": isOpen
      }
    },
    {new: true},     //set this parameter so the 'addedStage' response is of the new updated form, not the previous version.
    function(err, addedStage) {
      res.send(addedStage)
    });
  },

  removeStage(req, res) {
    //query below is in MongoDB query format
  	applicationModel.findByIdAndUpdate(req.params.id, {
	    $pop: {
	      "stages": 1
      }
    },
    {new: true},      //set this parameter so the 'addedStage' response is of the new updated form, not the previous version.
    function(err, removedStage) {
      res.send(removedStage)
    });

  },

	editStage(req, res) {
    //remove the 'editorEnabled' boolean from the editor request body. Then proceed to update the application. TODO rename editStage to editApp
    //query below is in MongoDB query format
    delete req.body.edit.editorEnabled;
	  applicationModel.findByIdAndUpdate(req.params.id, req.body.edit, {new: true}, function(err, stage) {
	    res.send(stage)
	  });
  },

  deleteApp(req, res) {
    //query below is in MongoDB query format
	  applicationModel.findByIdAndRemove(req.params.id, function(err, removed) {
	    res.send(removed);
	  });
  }

};
