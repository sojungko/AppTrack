require('dotenv').config(); // This env configuration is coupled with the ".env" file that has our MongoDB database access username and password.
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'); //
const mongoose = require('mongoose');
const router = require('./routes.js');
//All further mongo/mongoose methods are already required from the imported Position and User models files.

//call express as app
var app = express();
module.exports.app = app;

//Setting up paths for frontend
// app.use(session({
//  secret: 'shhh, it\'s a secret',
//  resave: false,
//  saveUninitialized: true
// }));

app.use(router);
//app.use(express.static(path.join(__dirname, '/../node_modules')));
app.use(express.static(path.join(__dirname, '/../client/')));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//connect to mongo database named 'AppTrack'
//heroku, make project, mlab is available as heroku add-on

const url = 'mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@ds127998.mlab.com:27998/apptrack';
mongoose.connect(url);
console.log(url);

const port = process.env.PORT || 5000;

app.listen(port, (err) => {
  if (err) {
    console.log('Error occurred : ', err);
  } else {
    console.log('Server is listening to port : ', port);
  }
});
