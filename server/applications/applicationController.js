const Q = require('q');
const applicationModel = require('./applicationModel.js');
const jwt = require('jwt-simple');
// this file is not used -- im not sure what that means??

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
        if (newApplication) {
          res.send(newApplication);
        }
      })
      .fail((err) => {
        console.log("ERROR in creating position, server/positions/positionController : ", err);
      });
  },

  uploadFile(req, res) {
    console.log('REQUEST BODY : ', req.body);
  },

  addStage(req, res) {
  	applicationModel.findByIdAndUpdate(req.params.id, {
	    $push: {
	      "stages": req.body
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
  }

};
