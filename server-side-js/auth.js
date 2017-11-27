//https://gist.github.com/phalkunz/728ec54c7ccbfd3a97ec
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var users = require('../users.json')

// Register a login strategy
passport.use('login', new LocalStrategy(
    function(username, password, done) {
        // Checks if user can be found
        for (var i = 0; i < users.users.length; i++){
            var user = users.users[i];
            if(username === user.username && password === user.password) {
                return done(null, user);
            }
        }
        // No user found
        done(null, false, { message: 'Invalid username and password.' });
    }
));

// Required for storing user info into session 
passport.serializeUser(function(user, done) {
  done(null, user._id);
});
 
// Required for retrieving user from session
passport.deserializeUser(function(id, done) {
    // Find current user
    var currentUser = null;
    users.users.forEach(function(user){
        if (user._id === id){
            currentUser = user;
        }
    })
    done(null, currentUser);
});

module.exports = passport;