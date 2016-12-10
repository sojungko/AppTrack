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
      text: 'This is a test of the new application email system! You created a new application(id: '+ appInfo._id + ') for ' + appInfo.role +' at '+ appInfo.companyName +'!'
    }
  },

  closedApp: function(username ,userEmail, applicationName) {
    return {
      from: '"AppTrak" <' + emailConfig.email_user + '>',
      to: username + ' <' + userEmail + '>',
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
  text: 'This is a test of the email system!'
};

var email = {
  send: function(user, userApps) {
    var options = templates.weeklyReminder(user.username, user.email, userApps.length);
    transporter.sendMail(options, function(error, info) {
      if(error) {
        return console.log('ERROR: ', error);
      }
      console.log('Weekly Reminder Message Sent to ' + user.username + ': ', info.response);
    })
  },
  newSend: function(req, res) {
    console.log('NEW SEND REQ: ', req.body);
    var user;
    Users.find({_id:req.body.userId}, function(err, result) {
      var user = result[0];
      var options = templates.newApp(user, req.body);
      transporter.sendMail(options, function(err, info) {
        if(err) { return console.log('ERROR: ', err); }
        console.log('NEW APP Message Sent: ', info.response);
      }) 
    })
    
  },
  closedSend: function(req, res) {
    var options = templates.closedApp(req.username, req.email, req.jobDescription, req.companyName);
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
