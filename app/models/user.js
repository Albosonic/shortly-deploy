var db = require('../config');
var Promise = require('bluebird');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');


var UserSchema = new mongoose.Schema({
  username: String,
  password: String
});

UserSchema.methods.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
    callback(isMatch);
  });
};

UserSchema.methods.hashPassword = function() {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
  .then(function(hash) {
    this.password = hash;
  });
};

module.exports = mongoose.model('User', UserSchema);
