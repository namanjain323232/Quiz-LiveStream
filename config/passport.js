var LocalStrategy = require('passport-local').Strategy;

// load up the user model
const User = require('../app/models/user');

// expose this function to our app using module.exports
module.exports = function (passport) {


    passport.use(User.createStrategy());
    passport.serializeUser(User.serializeUser());

    // used to deserialize the user
    passport.deserializeUser(User.deserializeUser());
    };

