const User = require('./users/userModel.js'); //The file with the defined user schema is required here.

require('dotenv').config(); // This env configuration is coupled with the ".env" file that has our MongoDB database access username and password.
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'); //
const mongoose = require('mongoose');
const Position = require('./positions/positionModel.js') //Positions schema is required here as well.

//All further mongo/mongoose methods are already required from the imported Position and User models files.

//call express as app
var app = express();

//Setting up paths for frontend
// app.use(session({
//  secret: 'shhh, it\'s a secret',
//  resave: false,
//  saveUninitialized: true
// }));

app.use(express.static(path.join(__dirname, '/../node_modules')));
app.use(express.static(path.join(__dirname, '/../client/')));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//connect to mongo database named 'AppTrack'
//heroku, make project, mlab is available as heroku add-on

let url = 'mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@ds119608.mlab.com:19608/apptrakdb';
mongoose.connect(url);
console.log(url)


//post request endpoint that is initialized in our $http post request in our Angular formController.
// This saves all form inputs to our database which can be viewed via https://mlab.com/
app.post('/form', function(req, res) {

    new Position({
            startDate: req.body.data.startDate,
            companyName: req.body.data.companyName,
            role: req.body.data.role,
            jobDescription: req.body.data.jobDescription,
            appliedThrough: req.body.data.appliedThrough,
            contactName: req.body.data.contactName,
            contactPhone: req.body.data.contactPhone,
            contactEmail: req.body.data.contactEmail,
            contactType: req.body.data.contactType,
            dateApplied: req.body.data.dateApplied,
            dateOfLastContact: req.body.data.dateOfLastContact,
            replyReceived: req.body.data.replyReceived,
            stages: req.body.data.stages,
            contractTime: req.body.data.contractTime,
            initialComp: req.body.data.initialComp,
            negotiated: req.body.data.negotiated,
            finalComp: req.body.data.finalComp,
            acceptReject: req.body.data.acceptReject
        })
        .save(); //mongoose function that saves inputs into the database.
});

// get request endpoint for $http get request made in the getData factory function.
app.get('/form', function(req, res) {
    //.find is a MongoDb method that will retrieve all data corresponding data that matches given conditions. Here there are no conditions set, so all postitions in the db will be sent back.
    Position.find(function(err, positions) {
        res.send(positions);
    });
})

// This end point responds to $http.put request made in formController by sending back
// the newly submitted stage for a given application by its accessing its unique id. This id is then concatenated in the formController with '/form/'.
// the database input is looked up by its unique id and its stages body is redefined below and then pushed into the stages array with the $Push MongoDB method.
app.put('/form/:id', function(req, res) {
    Position.findByIdAndUpdate(req.params.id, {
            $push: {
                "stages": req.body
            }
        },
        function(err, stage) {
            res.send(stage)
        })
})

app.put('/edit/:id', function(req, res) {
	console.log('THIS IS REQ.BODY EDIT INFO: ', req.body)
    Position.findByIdAndUpdate(req.params.id, req.body,
        function(err, stage) {
            res.send(stage)
        })
})

// Signup end point that gathers the input username and password and then utilizes the .find method to locate the given username. If the user length is nonexistence than a new one is created.
// The newUser is then saved to the database's user collection with .save.
app.post('/signup', function(req, res) {
    console.log("req.body", req.body)
    var username = req.body.username;
    var password = req.body.password;

    User.find({
            username: username
        },
        function(err, user) {
            if (user.length === 0) {
                var newUser = new User({
                    username: username,
                    password: password
                });

                newUser.save();
                console.log('getting past save');
            } else {
                console.log('Account already exists');
            }
        }
    );
});


//set up the server on env.PORT or 8080
const port = process.env.PORT || 8080;
app.listen(port, (err) => {
    if (err) {
        return console.log('Error occurred: ', err);
    }
    console.log('Server is listening on port: ', port);
})
