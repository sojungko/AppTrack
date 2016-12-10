var Apps = require('../applications/applicationModel.js');
var Users = require('../users/userModel.js');
var emails = require('./emailModel.js');

var allUsers = Users.find();
var allApps = Apps.find();
var weeklyReminderSender = function() {
  console.log('WEEKLY REMINDER !!')
  setInterval(function() {
    console.log('allUsers helpers.js', allUsers);
    console.log('allApps helpers.js', allApps);
    var day = new Date();
    day = day.getDay(); // return number 0-6 where 0 is sunday
    if(day === 1) {
      for(var i = 0; i < allUsers.length; i++) {
        var userApps = [];
        allApps.forEach(function(app) {
          if(app.userId === allUsers[i].id) {
            userApps.push(app);
          }
        });

        /*
          $http({
            method: 'POST',
            url: /api/reminder,
            data: userApps
          });
        */
      }
    }
  }, 1000 * 60);
};

module.exports = weeklyReminderSender;