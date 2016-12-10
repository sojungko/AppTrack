const userModel = require('./userModel.js');
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');


module.exports = {
	signUp({ body: { username, password, email } }, res) {
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
							var token = jwt.encode(newUser, 'apptrak')
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
	  userModel.findOne({ username: username })
	    .exec(function(err, user) {
	      if (!user) {
	        res.sendStatus(401);
	      } else {
	        bcrypt.compare(password, user.password, function(err, results) {
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
