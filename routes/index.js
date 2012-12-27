var path = require('path'),
  passport = require('passport');

exports.login_page = function(req, res){
  res.render('login');
};

exports.login = passport.authenticate('local', {
  successRedirect: '/logged',
  failureRedirect: '/login',
  falshFailure: true
});

exports.logged = function  (req, res) {

  var vars = {session: null};

  if (req.user !== undefined) {
    vars.session = req.user.role;
  }

  res.render('logged', vars);
};