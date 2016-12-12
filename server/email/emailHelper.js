var Apps = require('../applications/applicationModel.js');
var Users = require('../users/userModel.js');
var emails = require('./emailModel.js');

var weeklyReminderSender = function() {
  var reg = /\w+/;
  var user;
  setInterval(function(){
    Users.find({username:reg}, function(err, data) {
      var users = data;
      for(var i = 0; i < users.length; i++) {
        (function(index){
          Apps.find({userId:users[index].id}, function(err, apps) {
            var userApps = apps;
            if(userApps.length > 0) {
              emails.send(users[index], userApps);
            }
          });
        })(i)
      }
    });
  }, 1000 * 60 /* * 60 * 24 */)
};
module.exports = weeklyReminderSender;