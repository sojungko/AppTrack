require('dotenv').config(); // This env configuration is coupled with the ".env" file that has our MongoDB database access username and password.
require('./config.js');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'); //
const router = require('./routes.js');
const weeklyReminder = require('./email/emailHelper.js');
const app = express();

module.exports = app;
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(router);
app.use(express.static(path.join(__dirname, '/../client/')));
app.use(express.static(path.join(__dirname, '/../client/app')));
app.use(express.static(path.join(__dirname, '/../node_modules')));

const port = process.env.PORT || 5000;

app.listen(port, (err) => {
  if (err) {
    console.log('Error occurred : ', err);
  } else {
    var reminded = false;
    while(!reminded){
      console.log('Starting weekly reminder function');
      weeklyReminder(); // function lives in emailHelper.js
      reminded = true;
    }
    console.log('Server is listening to port : ', port);
  }
});
