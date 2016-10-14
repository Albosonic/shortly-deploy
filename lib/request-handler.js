var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');
var Users = require('../app/collections/users');
// var Links = require('../app/collections/links');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  console.log(req.url);
  User.find().exec(function(links) {
    res.status(200).send(links);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;
  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }
  Link
  .find({ url: uri })
  .exec(function(found) {
    if (found) {
      console.log('*****founwd', found);
      res.status(200).send(found.attributes);
    } else {

      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.sendStatus(404);
        }
        var link = new Link({
          url: uri,
          title: title,
          baseUrl: req.headers.origin
        });
        link.save(function(err) {
          if (!err) {
            Link.find({uri: uri}).exec(function(newLink) {
              res.status(200).send(newLink);
            });
          }
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username: username}).exec(function(err, user) {
    if (!user) {
      res.redirect('/login');
    } else {
      user.comparePassword(password, function(match) {
        if (match) {
          util.createSession(req, res, user);
        } else {
          res.redirect('/login');
        }
      });
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  User.findOne({username: username}).exec(function(err, user) {
    if (!user) {
      var user = new User({username: username, password: password});
      user.hashPassword().then(function() {
        user.save(function(err) {
          if (!err) {
            util.createSession(req, res, user);
          } else {
            console.log('Account already exists');
            res.redirect('/signup');
          }
        });
      });
    } else {
      res.redirect('/login');
    }
  });
};

exports.navToLink = function(req, res) {
  // new Link({ code: req.params[0] }).fetch().then(function(link) {
  //   if (!link) {
  //     res.redirect('/');
  //   } else {
  //     link.set({ visits: link.get('visits') + 1 })
  //       .save()
  //       .then(function() {
  //         return res.redirect(link.get('url'));
  //       });
  //   }
  // });
};