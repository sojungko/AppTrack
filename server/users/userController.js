const userModel = require('./userModel.js');
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');


module.exports = {
	signUp({ body: { username, password, email } }, res) {
		//pluck req.body out into object, pluck username, password and email. variables accessible below
	  userModel.findOne({ username: username })
	    .exec((err, user) => {
	      if (!user) {
					bcrypt.hash(password, null, null, (err, hash) => {
						var newUser = new userModel({
							username: username,
							password: hash,
							email: email
						});
						newUser.save(function(err, newUser) {
							if (err) {
								res.status(500).send(err);
							}
							//after saving user, newUser response contains object with saved user's properties
							//access properties and save ID, username, and email to 'returning' var to encode
							//and send up to front end to attach as header.
							//Token header contains username and ID for later HTTP calls for email functionality.
							var returning = {_id: newUser._id, username: newUser.username, email: newUser.email };
							var token = jwt.encode(returning, 'apptrak')
							res.json(token);
						});
					})
	      } else {
	        console.log('Account already exists');
	        res.sendStatus(401);
	      }
	    });
	},

	signIn( { body: { username, password } }, res) {
	  userModel.findOne({ username })
	    .exec(function(err, user) {
	      if (!user) {
	        res.sendStatus(401);
	      } else {
	        bcrypt.compare(password, user.password, function(err, results) {
	          if (results) {
							//after verifying user password, user response from findOne query contains object with saved user's properties.
							//access properties and save ID, username, and email to 'returning' var to encode
							//send up to front end to attach as header for authorization.
							//Token header contains username and ID for later HTTP calls for email functionality.
							var returning = {_id: user._id, username: user.username, email: user.email }
							var token = jwt.encode(returning, 'apptrak');
							res.send(token);
	          } else {
							res.sendStatus(401);
	          }
	        });
	      }
	    });
	},

	sendUsername(req , res) {
		//function called on page load, if request header contains a token then send back the decoded username for the "Welcome, **username**" in the nav bar.
		if(req.headers['x-access-token']) {
			const decoded = jwt.decode(req.headers['x-access-token'], 'apptrak');
			res.send(decoded.username);
		}
	}
}
