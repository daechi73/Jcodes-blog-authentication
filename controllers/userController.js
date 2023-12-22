const asyncHandler = require("express-async-handler");
const User = require("../models/user.js");
const passport = require("passport");

exports.users_get = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  if (users) res.send(Object.values(users));
  else res.send("No Users Found");
});

exports.user_detail = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).exec();

  if (user === null) {
    const err = new Error("User not found");
    err.status = 404;
    return next(err);
  }

  res.send(Object.values(user));
});

exports.user_sign_up = [
  asyncHandler(async (req, res, next) => {
    passport.authenticate("local", (err, user, options) => {
      if (!user) {
        res.json("Log in failed, try again");
      }
      req.login(user, (err) => {
        if (err) return next(err);
        return res.json({ status: "success" });
      });
    })(req, res, next);
  }),
];
