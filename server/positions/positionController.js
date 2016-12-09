const Q = require('q');
const positionModel = require('./positionModel.js');
// this file is not used -- im not sure what that means??

const findPosition = Q.nbind(positionModel.findOne, positionModel);
const createPosition = Q.nbind(positionModel.create, positionModel);
const findAllPositions = Q.nbind(positionModel.find, positionModel);

module.exports = {
  allPositions(req, res) {
    findAllPositions({})
      .then((positions) => {
        res.json(positions);
      })
      .fail((err) => {
        console.log("ERROR in retreiving all positions, server/positions/positionController : ", err);
      });
  },

  newPosition(req, res) {
    createPosition(req.body.data)
      .then((createdPosition) => {
        if (createdPosition) {
          console.log("CREATE position request: ", req.body.data);
          res.json(createdPosition);
        }
      })
      .fail((err) => {
        console.log("ERROR in creating position, server/positions/positionController : ", err);
      });
  },

	addStage(req, res) {
	  positionModel.findByIdAndUpdate(req.params.id, {
	    $push: {
	      "stages": req.body
	    }
	  },
	  function(err, stage) {
	    res.send(stage)
	  });
	},

	editStage(req, res) {
	  console.log('THIS IS REQ.BODY EDIT INFO: ', req.body)
		//   Position.findByIdAndUpdate(req.params.id, req.body, function(err, stage) {
		//     res.send(stage)
		//   });
	},
};
