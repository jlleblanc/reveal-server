var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  config = require('./config');

passport.use(new LocalStrategy(
  function(username, password, done) {

    if (config.get('password') == password) {
      return done(null, {role: 'presenter'});
    }

    return done(null, false, { message: 'Invalid credentials' });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.role);
});

passport.deserializeUser(function(role, done) {
  done(null, {role: role})
});

module.exports = passport;