const Q = require('q');
const applicationModel = require('./applicationModel.js');
const jwt = require('jwt-simple');
const fs = require('fs');
const path = require('path');
const multer  = require('multer');
var upload = multer({ dest: 'uploads/' }).single('file');

const findApplication = Q.nbind(applicationModel.findOne, applicationModel);
const createApplication = Q.nbind(applicationModel.create, applicationModel);
const findAllApplication = Q.nbind(applicationModel.find, applicationModel);

module.exports = {
  allPositions(req, res) {
    findAllApplication({})
      .then((positions) => {
        res.json(positions);
      })
      .fail((err) => {
        console.log("ERROR in retreiving all positions, server/positions/positionController : ", err);
      });
  },

  createApplication({ body: { form } }, res) {
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

//TODO
  uploadFile(req, res) {
    console.log('REQUEST BODY : ', req.body);
    upload(req, res, function(err) {
      if (err) {
        console.log('Error uploading file');
      } else {
        console.log('Inside uploadFile!');
      }
    });

  },

  addStage(req, res) {
    var isOpen = true;
    if(req.body.interviewType === 'Application Complete'){
      isOpen = false;
    }
    console.log("STAGE BODY : ", req.body)

  	applicationModel.findByIdAndUpdate(req.params.id, {
	    $push: {
	      "stages": req.body
      },
      $set: {
        "isOpen": isOpen
      }
    },
    {new: true},
    function(err, addedStage) {
      console.log("ADD STAGE AFTER: ", addedStage);
      res.send(addedStage)
    });
  },

  removeStage(req, res) {
  	applicationModel.findByIdAndUpdate(req.params.id, {
	    $pop: {
	      "stages": 1
      }
    },
    {new: true},
    function(err, removedStage) {
      res.send(removedStage)
    });

  },

	editStage(req, res) {
    delete req.body.edit.editorEnabled;
	  applicationModel.findByIdAndUpdate(req.params.id, req.body.edit, {new: true}, function(err, stage) {
	    res.send(stage)
	  });
  },

  deleteApp(req, res) {
	  applicationModel.findByIdAndRemove(req.params.id, function(err, removed) {
	    res.send(removed);
	  });
  }

};
