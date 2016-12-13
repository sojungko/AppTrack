var Apps = require('../applications/applicationModel.js');
var Users = require('../users/userModel.js');
var emails = require('./emailModel.js');

var weeklyReminderSender = function() {
  var reg = /\w+/;
  var user;
  var flag = false;
  setInterval(function(){
    console.log('INSIDE SET INTERVAL')
    var date = new Date();
    var day = date.getDay();
    var hour = date.getHours();
    if(day === 2 && !flag) {
      flag = true
      Users.find({username:reg}, function(err, data) {
        var users = data;
        for(var i = 0; i < users.length; i++) {
          (function(index){
            Apps.find({userId:users[index].id}, function(err, apps) {
              var userApps = apps;
              if(userApps.length > 0) {
                console.log('sending mail')
                emails.send(users[index], userApps);
              }
            });
          })(i)
        }
      });
    } else if(!(day === 2 && hour === 11)){
      flag = false;
    }
  }, 1000 * 60 * 20);
};
module.exports = weeklyReminderSender;