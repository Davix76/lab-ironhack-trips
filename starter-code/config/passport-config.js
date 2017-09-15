const passport = require('passport');
const UserModel = require('../models/user-model.js');

//serialiezUser is called when the user logs in
//it determines what gets saved into the session when you log in
passport.serializeUser((user, done) => {
  done(null, user._id);
});

//deserializeUser is called on every request AFTER logging in
passport.deserializeUser((id, done) => {
  UserModel.findById(
    id,
    (err, userFromDb) => {
      if (err) {
        done(err);
        return;
      }
      //give passport the user document from the database
      done(null, userFromDb);
    }
  );
});



const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.google_app_id,
      clientSecret: process.env.google_app_secret,
      callbackURL: "/auth/google/callback",
      proxy: true
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      UserModel.findOne(
        {provider_id: profile.id},
        (err, userFromDb) => {
          if(err){
            done(err);
            return
          }
          if (userFromDb) {
            done(null, userFromDb);
            return;
          }
          const theUser = new UserModel({
            provider_id: profile.id,
            provider_name: profile.emails[0].value
          });
          theUser.save((err) => {
            if(err){
              done(err);
              return;
            }
            done(null, theUser);
          })
        }
      );
    }
  )
);
