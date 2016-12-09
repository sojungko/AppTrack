const Q = require('q');
const applicationModel = require('./applicationModel.js');
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
    console.log('positionController: ', form);
    createApplication(form)
      .then((newApplication) => {
        if (newApplication) {
          console.log("CREATE position request: ", newApplication);
          res.send(newApplication);
        }
      })
      .fail((err) => {
        console.log("ERROR in creating position, server/positions/positionController : ", err);
      });
  },
};
