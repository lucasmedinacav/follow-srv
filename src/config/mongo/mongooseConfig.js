'use restrict'
let mongoose = require('mongoose'),
  dbURI = 'ds155073.mlab.com:55073/lucasmedinadb',
  user = 'lucasmedina',
  password = 'admin123'

mongoose.connect('mongodb://' + user + ':' + password + '@' + dbURI);

mongoose.connection.on('connected', function () {
  console.info('CONNECTED: Mongoose default connection open to ' + dbURI);
});

mongoose.connection.on('error', function (err) {
  console.error('ERROR: Mongoose default connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.error('DISCONNECTED: Mongoose default connection disconnected');
});

process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.error('DISCONNECTED: Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});