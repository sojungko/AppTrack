var emailConfig = require('./emailConfig');
var nodemailer = require('nodemailer');
var Users = require('../users/userModel.js');

var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  secureConnection: true,
  auth: {
    user: emailConfig.email_user,
    pass: emailConfig.email_pass
  }
});

var templates = {
  newApp: function(user ,appInfo) {
    return {
      from: '"AppTrak" <' + emailConfig.email_user + '>',
      to: user.username + ' <' + emailConfig.email_user + '>',
      subject: 'New Application Created',
      html: '<h1 style="color: #025FE8">Application ID:<b style="color: #656765">'+appInfo._id+'</b></h1><br /><b style="font-size: 160%;">You created a new application for '+appInfo.role+' at '+appInfo.companyName+'!</b><br /><p><link href="localhost:5000">Click here to view open applications.</link></p>'
    }
  },

  closedApp: function(username ,userEmail, applicationName) {
    return {
      from: '"AppTrak" <' + emailConfig.email_user + '>',
      to: username + ' <' + emailConfig.email_user + '>',
      subject: 'Application Closed',
      text: 'This is a test of the closed application email system!'
    }
  },
  weeklyReminder: function(username ,userEmail, numberOfApps) {
    return {
      from: '"AppTrak" <' + emailConfig.email_user + '>',
      to: username + ' <' +  emailConfig.email_user + '>',
      subject: 'Weekly App Reminder',
      text: 'This is a test of the weekly reminder email system! You have ' + numberOfApps +' applications still open!'
    }
  },
  deletedApp: function(username, userEmail, appInfo) {
    return {
      from: '"AppTrak" <' + emailConfig.email_user + '>',
      to: username + ' <' +  emailConfig.email_user + '>',
      subject: 'Application Deleted',
      text: 'This is a test of the deleted App email system! You DELETED Application '+ appInfo._id +' for '+ appInfo.role +' at '+ appInfo.companyName +'!'
    }
  }
};

var testMailOptions = {
  from: '"AppTrak" <' + emailConfig.email_user + '>',
  to: '"AppTrak" <' + emailConfig.email_user + '>',
  subject: 'Test',
  html: '<h1 style="color: #025FE8">Application ID:<b style="color: #656765">TEST ID</b></h1><br /><b style="color: #6702FF">TESTING</b>'
};

var email = {
  send: function(user, userApps) {
    var options = templates.weeklyReminder(user.username, user.email, userApps.length);
    transporter.sendMail(testMailOptions, function(error, info) {
      if(error) {
        return console.log('ERROR: ', error);
      }
      console.log('Weekly Reminder Message Sent to ' + user.username + ': ', info.response);
    })
  },
  newSend: function(req, res) {
    console.log('NEW SEND REQ: ', req.body);
    var user;
    Users.find({_id:req.body.data.userId}, function(err, result) {
      var user = result[0];
      var options = templates.newApp(user, req.body.data);
      transporter.sendMail(options, function(err, info) {
        if(err) { return console.log('ERROR: ', err); }
        console.log('NEW APP Message Sent: ', info.response);
      })
    })

  },
  closedSend: function(req, res) {
    console.log("CLOSED SEND REQ: ", req.body);
    var options = templates.closedApp(req.body.data.username, req.body.data.email);
    transporter.sendMail(options, function(err, info) {
      if(err) { return console.log('ERROR: ', err); }
      console.log('CLOSED APP Message Sent: ', info.response);
    })
  },
  deletedSend: function(req, res) {
    var app = req.body.data;
    var user;
    Users.find({_id:req.body.data.userId}, function(err, result) {
      if(err) {console.log("ERROR: ", err)}
      user = result[0];

      var options = templates.deletedApp(user.username, user.email, app);
      transporter.sendMail(options, function(err, info) {
      if(err) { return console.log('ERROR: ', err); }
      console.log('DELETED APP Message Sent: ', info.response);
      })
    });
  }
};
module.exports = email;
