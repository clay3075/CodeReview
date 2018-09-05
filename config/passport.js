var User = require("../models/user");

//set up passport
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {

    passport.use('local-login', new LocalStrategy(
        {
            usernameField : 'email',
            passwordField : 'password'
        },
        function(email, password, done) {
            User.findOne({ 'email' :  email }, function(err, user) {
                if (err) { return done(err); }
                if (!user) {
                    return done(null, false, { message: 'Incorrect email.' });
                } 
                if (!user.validPassword(password)) {
                    return done(null, false, { message: 'Incorrect password.' });
                } 
                return done(null, user);
            });
        }
    ));

    passport.use('local-signup', new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        function(email, password, done) {
            User.findOne({ 'email' : email }, function(err, user) {
                console.log('in')
                if (err) { return done(err); }
                console.log(user);
                if (user) {
                    return done(null, false, {message: 'That email is already taken.'})
                } else {
                    var newUser = new User();

                    newUser.email = email;
                    newUser.password = newUser.generateHash(password);

                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user);
    });
      
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });
}
