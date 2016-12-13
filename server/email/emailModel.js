var emailConfig = require('./emailConfig');
var nodemailer = require('nodemailer');
var Users = require('../users/userModel.js');
var path = require('path');

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
      html: '<table><tr><td><img src="cid:unique@appTrak.ee" width="300" height="230" style="display: block;"/></td></tr><br /><tr><td><b style="font-size: 125%;">Dear '+user.username+',</b></td></tr><br /><br /><tr><td><b style="font-size: 125%;">You created a new application for '+ appInfo.role +' at '+ appInfo.companyName +'!</b></td></tr><tr><td><h2 style="color: #025FE8">Application ID:<b style="color: #656765">' + appInfo._id + '</b></h2></td></tr><tr><td><p style="font-size: 125%;"><a href="apptrakk.herokuapp.com">Click here to view open applications.</a></p></td></tr></table>',
      attachments: [{
        filename: 'appTrak.png',
        path: path.join(__dirname + '/image/appTrak.png'),
        cid: 'unique@appTrak.ee' //same cid value as in the 
      }]
    }
  },

  closedApp: function(user, appInfo) {
    return {
      from: '"AppTrak" <' + emailConfig.email_user + '>',
      to: user.username + ' <' + emailConfig.email_user + '>',
      subject: 'Application Closed',
      html: '<table><tr><td><img src="cid:unique@appTrak.ee" width="300" height="230" style="display: block;"/></td></tr><</tr><br /><tr><td><b style="font-size: 125%;">Dear '+user.username+',</b></td></tr><br /><br /><tr><td><b style="font-size: 125%;">You closed an application for '+appInfo.role+' at '+appInfo.companyName+'!</b></td></tr>tr><td><h2 style="color: #025FE8">Application ID:<b style="color: #656765">'+appInfo._id+'</b></h2></td><tr><td><p style="font-size: 125%;"><a href="apptrakk.herokuapp.com">Click here to view closed applications.</a></p></td></tr></table>',
      attachments: [{
        filename: 'appTrak.png',
        path: path.join(__dirname + '/image/appTrak.png'),
        cid: 'unique@appTrak.ee' //same cid value as in the 
      }]
    }
  },
  weeklyReminder: function(username ,userEmail, numberOfApps) {
    return {
      from: '"AppTrak" <' + emailConfig.email_user + '>',
      to: username + ' <' +  emailConfig.email_user + '>',
      subject: 'Weekly App Reminder',
      html: '<table><tr><td><img src="cid:unique@appTrak.ee" width="300" height="230" style="display: block;"/></td></tr><tr><td><b style="font-size: 125%;">Dear '+username+',</b><</td></tr>br /><br /><tr><td><b style="font-size: 125%;">You have '+numberOfApps+' application\'s open!</b></td></tr><tr><td><p><a href="apptrakk.herokuapp.com">Click here to view all open applications.</a></p></td></tr></table>',
      attachments: [{
        filename: 'appTrak.png',
        path: path.join(__dirname + '/image/appTrak.png'),
        cid: 'unique@appTrak.ee' //same cid value as in the 
      }]
    }
  },
  deletedApp: function(user, appInfo) {
    return {
      from: '"AppTrak" <' + emailConfig.email_user + '>',
      to: user.username + ' <' +  emailConfig.email_user + '>',
      subject: 'Application Deleted',
      html: '<table><tr><td><img src="cid:unique@appTrak.ee" width="300" height="230" style="display: block;"/></td></tr><tr><td><br /><b style="font-size: 125%;">Dear '+user.username+',</b></td></tr><br /><br /><tr><td><b style="font-size: 125%;">You deleted an application for '+appInfo.role+' at '+appInfo.companyName+'!</b></td></tr><tr><td><h2 style="color: #025FE8">Application ID:<b style="color: #656765">'+appInfo._id+'</b></h2></td></tr></table>',
      attachments: [{
        filename: 'appTrak.png',
        path: path.join(__dirname + '/image/appTrak.png'),
        cid: 'unique@appTrak.ee' //same cid value as in the 
      }]
    }
  }
};

// var testMailOptions = {
//   from: '"AppTrak" <' + emailConfig.email_user + '>',
//   to: '"AppTrak" <' + emailConfig.email_user + '>',
//   subject: 'Test',
//   html: '<h1 style="color: #025FE8">Application ID:<b style="color: #656765">TEST ID</b></h1><br /><b style="color: #6702FF">TESTING</b>'
// };

var email = {
  send: function(user, userApps) {
    var options = templates.weeklyReminder(user.username, user.email, userApps.length);
    transporter.sendMail(options, function(error, info) {
      if(error) {
        return console.log('ERROR: ', error);
      }
      console.log('Weekly Reminder Message Sent to ' + user.username + ': ', info.response);
      transporter.close();
      return info.response;
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
        transporter.close();
        res.send(info.response);
      })
    })

  },
  closedSend: function(req, res) {
    var user;
    Users.find({_id:req.body.data.userId}, function(err, results) {
      user = results[0];
      if(user) {
        var options = templates.closedApp(user, req.body.data);
        transporter.sendMail(options, function(err, info) {
          if(err) { return console.log('ERROR: ', err); }
          console.log('CLOSED APP Message Sent: ', info.response);
          transporter.close();
          res.send(info.response);
        });
      }
    });
  },
  deletedSend: function(req, res) {
    var app = req.body.data;
    var user;
    Users.find({_id:req.body.data.userId}, function(err, result) {
      if(err) {console.log("ERROR: ", err)}
      user = result[0];

      var options = templates.deletedApp(user, app);
      transporter.sendMail(options, function(err, info) {
        if(err) { return console.log('ERROR: ', err); }
        console.log('DELETED APP Message Sent: ', info.response);
        transporter.close();
        res.send(info.response);
      })
    });
  }
};
module.exports = email;
