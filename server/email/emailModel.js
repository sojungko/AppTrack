var emailConfig = require('./emailConfig');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  secureConnection: true,
  auth: {
    user: emailConfig.email_user,
    pass: emailConfig.email_pass
  }
});

var templates = {
  newApp: function(username ,userEmail, applicationName) {
    return {
      from: '"AppTrak" <' + emailConfig.email_user + '>',
      to: username + ' <' + userEmail + '>',
      subject: 'New Application',
      text: 'This is a test of the new application email system!' 
    }
  },

  closedApp: function(username ,userEmail, applicationName) {
    return {
      from: '"AppTrak" <' + emailConfig.email_user + '>',
      to: username + ' <' + userEmail + '>',
      subject: 'Closed Application',
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
  deletedApp: function(username, userEmail, applicationInfo) {
    return {
      from: '"AppTrak" <' + emailConfig.email_user + '>',
      to: username + ' <' +  emailConfig.email_user + '>',
      subject: 'Weekly App Reminder',
      text: 'This is a test of the deleted App email system!' 
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
    console.log('SEND FUNC USER: ', user)
    var options = templates.weeklyReminder(user.username, user.email, userApps.length);
    transporter.sendMail(options, function(error, info) {
      if(error) {
        return console.log('ERROR: ', error);
      }
      console.log('Weekly Reminder Message Sent to ' + user.username + ': ', info.response);
    })
  },
  newSend: function(req, res) {
    var options = templates.newApp('appTrak', emailConfig.email_user, req.req.jobDescription, req.companyName);
    transporter.sendMail(options, function(err, info) {
      if(err) { return console.log('ERROR: ', err); }
      console.log('NEW APP Message Sent: ', info.response);
    })
  },
  closedSend: function(req, res) {
    var options = templates.closedApp(req.username, req.email, req.jobDescription, req.companyName);
    transporter.sendMail(options, function(err, info) {
      if(err) { return console.log('ERROR: ', err); }
      console.log('NEW APP Message Sent: ', info.response);
    })
  },
  deletedSend: function(req, res) {

  }
};
module.exports = email;