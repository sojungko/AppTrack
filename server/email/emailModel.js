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
var mailOptions = {
  from: '"AppTrak" <' + emailConfig.email_user + '>',
  to: '"AppTrak" <' + emailConfig.email_user + '>',
  subject: 'Test',
  text: 'This is a test of the email system!'
};

var email = {
  send: function(req, res) {
    transporter.sendMail(mailOptions, function(error, info) {
      if(error) {
        return console.log('ERROR: ', error);
      }
      console.log('Message Sent: ', info.response);
    })
  }
};
module.exports = email;