const express = require("express");
const router = express.Router();

const User = require("../models/user");

const wrapAsync = require("../utils/wrapAsync");

const passport = require("passport");
// const LocalStrategy = require('passport-local')

const users = require("../controllers/users");

router
  .route("/register")
  .get(users.renderRegisterForm)
  .post(wrapAsync(users.register));

router
  .route("/login")
  .get(users.renderLogIn)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login
  );

router.get("/logout", users.logout);

module.exports = router;
