var mongoose = require('mongoose');
// this file describes the userSchema for how mongoose writes to the database
// this is only used in the sign up endpoint

var UserSchema = new mongoose.Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  email: { type: String, required: true }
});

var User = mongoose.model('User', UserSchema);

User.comparePassword = ((candidatePassword, savedPassword, cb) => {
  bcrypt.compare(candidatePassword, savedPassword, function(err, isMatch) {
    if (err) { return cb(err); }
    cb(null, isMatch);
  });
});

module.exports = User;
