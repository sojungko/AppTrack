const User = require('./userModel.js');
const jwt = require('jwt-simple');

module.exports = {
	signUp: (req, res) => {
	  var username = req.body.username;
	  var password = req.body.password;

	  User.findOne({ username: username })
	    .exec((err, user) => {
	      if (!user) {
	        var newUser = new User({
	          username: username,
	          password: password
	        });
	        newUser.save(function(err, newUser) {
	          if (err) {
	            res.status(500).send(err);
	          }
						var token = jwt.encode(username, 'apptrak')
	          res.send(token);
	        });
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
	      if (!user) {
	        res.redirect('/login'); //is this redirect going to work?
	      } else {
	        User.comparePassword(password, user.password, function(err, match) {
	          if (match) {
	            var token = jwt.encode(username, 'apptrak');
							res.send(token);
	          } else {
	            res.send(401);
	          }
	        });
	      }
	    });
	},
}
