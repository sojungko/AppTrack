const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const path = require('path');
const fs = require('fs');

module.exports = {

  const url = 'mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@ds127998.mlab.com:27998/apptrack';
  mongoose.connect(url);

  mongoose.Promise = global.Promise;

// Don't know what I'm doing here. Playing with GridFS.
  const conn = mongoose.connection;
  Grid.mongo = mongoose.mongo;

  const filePath = (path.join(__dirname, '')); //TODO

  conn.once('open', function() {
    console.log('Connection open');
    const gfs = Grid(conn.db);
    const writeStream = gfs.createWriteStream({
      filename: '' //TODO
    });

    fs.createReadStream(filePath).pipe(writeStream);
    writeStream.on('close', function(file) {
      console.log(file.filename + ' written to DB');
    })
  })

}
