var db = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose');

var mongoose = require('mongoose');


var LinkSchema = new mongoose.Schema({
  username: String,
  password: String
});

var Link = mongoose.model('Link', LinkSchema);

module.exports = Link;
