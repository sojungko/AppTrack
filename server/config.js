const mongoose = require('mongoose');

const url = 'mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@ds127998.mlab.com:27998/apptrack';
mongoose.connect(url);
mongoose.Promise = global.Promise;

module.exports = mongoose.conn;
