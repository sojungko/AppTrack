const User = require('./userModel.js');
const jwt = require('jwt-simple');
var bcrypt = require('bcrypt-nodejs');


module.exports = {
	signUp: (req, res) => {
	  var username = req.body.username;
	  var password = req.body.password;
		var email = req.body.email;

	  User.findOne({ username: username })
	    .exec((err, user) => {
	      if (!user) {
					bcrypt.hash(password, null, null, (err, hash) => {
						var newUser = new User({
							username: username,
							password: hash,
							email: email
						});
						newUser.save(function(err, newUser) {
							if (err) {
								res.status(500).send(err);
							}
							var token = jwt.encode(newUser, 'apptrak')
							res.send(newUser);
						});
					})
	      } else {
	        console.log('Account already exists');
	        res.send(401);
	      }
	    });
	},

	signIn: (req, res) => {
	  var username = req.body.username;
	  var password = req.body.password;

	  User.findOne({ username: username })
	    .exec(function(err, user) {
				var user = user;
	      if (!user) {
	        res.send(401);
	      } else {
	        User.comparePassword(password, user.password, function(err, match) {
	          if (match) {
	            var token = jwt.encode(user, 'apptrak');
							res.send(token);
	          } else {
	            res.send(401);
	          }
	        });
	      }
	    });
	},
}
