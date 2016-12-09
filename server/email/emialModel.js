var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  host: smtp.gmail.com,
  secureConnection: true,
  auth: {
    user: 
  }
})