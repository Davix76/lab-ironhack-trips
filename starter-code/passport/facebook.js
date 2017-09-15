const passport = require('passport');
const User = require('../models/User');
const FbStrategy = require('passport-facebook').Strategy;


passport.use(new FbStrategy({
  clientID: "147398975857299",
  clientSecret: "2afb2374ad7d1aac0c17393f18dc670d",
  callbackURL: "/auth/facebook/callback"
}, (accessToken, refreshToken, profile, done) => {
  User.findOne({ facebookID: profile.id }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (user) {
      return done(null, user);
    }

    const newUser = new User({
      facebookID: profile.id
    });

    newUser.save((err) => {
      if (err) {
        return done(err);
      }
      done(null, newUser);
    });
  });

}));
