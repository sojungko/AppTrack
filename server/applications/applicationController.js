const Q = require('q');
const applicationModel = require('./applicationModel.js');
const jwt = require('jwt-simple');
const fs = require('fs');
const path = require('path');
const multer  = require('multer');
var upload = multer({ dest: 'uploads/' }).single('coverLetter');

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

  uploadFile(req, res) {
    console.log('REQUEST BODY : ', req.body);
    upload(req, res, function(err) {
      if (err) {
        console.log('Error uploading file');
      } else {
        var filename = req.body.file.name;
        fs.writeFile(path.join(__dirname, '/uploads/', filename), filename, function(err, results) {
          if(err) {
            console.log('Error writing file : ', err)
          } else {
            res.end();
            console.log('Cover letter uploaded!')
          }
        });
      }
    })
  },

  addStage(req, res) {
    console.log("STAGE BODY : ", req.body)
    var isOpen = true;
    if(req.body.interviewType === 'Application Complete'){
      isOpen = false;
    }
  	applicationModel.findByIdAndUpdate(req.params.id, {
	    $push: {
	      "stages": req.body
      },
      $set: {
        "isOpen": isOpen
      }
    },
    function(err, stage) {
      console.log("ADD STAGE AFTER: ", stage);
      res.send(stage)
    });
  },

  removeStage(req, res) {
  	applicationModel.findByIdAndUpdate(req.params.id, {
	    $pop: {
	      "stages": 1
      }
    },
    function(err, stage) {
      res.send(stage)
    });

  },

	editStage(req, res) {
    delete req.body.edit.editorEnabled;
	  applicationModel.findByIdAndUpdate(req.params.id, req.body.edit, function(err, stage) {
	    res.send(stage)
	  });
  },

  deleteApp(req, res) {
	  applicationModel.findByIdAndRemove(req.params.id, function(err, removed) {
	    res.send(removed);
	  });
  }

};
