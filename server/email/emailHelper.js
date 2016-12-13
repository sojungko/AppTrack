var Apps = require('../applications/applicationModel.js');
var Users = require('../users/userModel.js');
var emails = require('./emailModel.js');

var weeklyReminderSender = () => { // fn called in server.js when server starts
  var reg = /\w+/; // regular expression that evaluates to any string containing letters and numbers
  var user; 
  var flag = false; // flag to determin if setIntervl should run inner function
  setInterval(() => {
    var date = new Date();
    var day = date.getDay();
    var hour = date.getHours();
    if(day === 2 && hour === 15 && !flag) { // if day is tuesday and hour is 3pm
      flag = true // set flag to true so wont be called again within the hour 
      Users.find({username:reg}, (err, data) => { // find user where username equals regEx.. will return all users
        var users = data; // set users to returned array
        for(let i = 0; i < users.length; i++) { // for each user in the DB
          Apps.find({userId:users[index].id}, (err, apps) => { // find all apps for that user
            var userApps = apps; // set userApps to array of returned applications
            if(userApps.length > 0) { // if the user has open applications
              emails.send(users[index], userApps); // call email.send function that is in emailModel.js passing in the user and array of their apps
            }
          });
        }
      });
    } else if(!(day === 2 && hour === 11)){ // if the day in not tuesday and the hour is not 3pm
      flag = false;
    }
  }, 1000 * 60 * 20); // run setInterval every 20 minutes
};
module.exports = weeklyReminderSender;