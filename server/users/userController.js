const userModel = require('./userModel.js');
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');


module.exports = {
	signUp(req, res) {
	  var username = req.body.username;
	  var password = req.body.password;

	  userModel.findOne({ username: username })
	    .exec((err, user) => {
	      if (!user) {
					bcrypt.hash(password, null, null, (err, hash) => {
						var newUser = new userModel({
							username: username,
							password: hash,
						});
						newUser.save(function(err, newUser) {
							if (err) {
								res.status(500).send(err);
							}
							var token = jwt.encode(newUser, 'apptrak')
							console.log('NEW USER TOKEN : ', token)
							res.send(newUser);
						});
					})
	      } else {
	        console.log('Account already exists');
	        res.sendStatus(401);
	      }
	    });
	},

	signIn(req, res) {
	  var username = req.body.username;
	  var password = req.body.password;

	  userModel.findOne({ username: username })
	    .exec(function(err, user) {
	      if (!user) {
					console.log('USER NOT FOUND');
	        res.sendStatus(401);
	      } else {
	        bcrypt.compare(password, user.password, function(err, results) {
						console.log('INPUT PW : ', password);
						console.log('PASSWORD : ', user.password);
						console.log('ERROR : ', err);
						console.log('RESULTS : ', results);
	          if (results) {
							var token = jwt.encode(user, 'apptrak');
							res.send(token);
	          } else {
							res.sendStatus(401);
	          }
	        });
	      }
	    });
	}
}
