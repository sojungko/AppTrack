var Apps = require('../applications/applicationModel.js');
var Users = require('../users/userModel.js');
var emails = require('./emailModel.js');


//  = Apps.find({}).toArray(function(err, results) {
//   if(err) {console.log('ERROR: ', err)}
//   return
// });
var weeklyReminderSender = function() {
  var reg = /\w+/;
  var user;
  setInterval(function(){
    Users.find({username:reg}, function(err, data) {
      var users = data;
      console.log('USERS !!!!!!!: ', users)
      for(var i = 0; i < users.length; i++) {
        user = users[i]
        Apps.find({userId:user.id}, function(err, apps) {
          console.log('APPLICATIONS: ', user)
          var userApps = apps;
          if(userApps.length > 0) {
            emails.send(user, userApps);
          }
        });
      }
    });
  }, 1000 * 5 /* * 60 * 24 */)
};
// var allApps = Apps.find({});
//   console.log('WEEKLY REMINDER !!')
//   console.log('allUsers helpers.js');
//   console.log('allApps helpers.js', allApps);
//   setInterval(function() {
//     console.log('allUsers helpers.js', allUsers);
//     console.log('allApps helpers.js', allApps);
//     var day = new Date();
//     day = day.getDay(); // return number 0-6 where 0 is sunday
//     if(day === 1) {
//       for(var i = 0; i < allUsers.length; i++) {
//         var userApps = [];
//         allApps.forEach(function(app) {
//           if(app.userId === allUsers[i].id) {
//             userApps.push(app);
//           }
//         });

//         /*
//           $http({
//             method: 'POST',
//             url: /api/reminder,
//             data: userApps
//           });
//         */
//       }
//     }
//   }, 1000 * 60);
// };

module.exports = weeklyReminderSender;