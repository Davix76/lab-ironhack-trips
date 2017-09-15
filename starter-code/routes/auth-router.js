const express = require('express');
const router = express.Router();
const passport = require('passport');
const UserModel = require("../models/user-model.js")

router.get("/auth/google", passport.authenticate("google", {
  scope: [
    "https://www.googleapis.com/auth/plus.login",
    "https://www.googleapis.com/auth/plus.profile.emails.read"
  ]
}));
console.log('auth router');
router.get("/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/my-trips",
      failureRedirect: "/login",
      failureFlash: true
  })
);

module.exports = router;
