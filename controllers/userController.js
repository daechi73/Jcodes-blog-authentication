const asyncHandler = require("express-async-handler");
const User = require("../models/user.js");
const passport = require("passport");
const HashedPassword = require("../public/javascripts/HashPassword.js");
const { body, validationResult } = require("express-validator");

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

exports.user_sign_in = [
  asyncHandler(async (req, res, next) => {
    passport.authenticate("local", (err, user, options) => {
      if (!user) {
        res.json("Log in failed, try again");
        //res.json(options.message);
      }
      req.login(user, (err) => {
        if (err) return next(err);
        return res.json({ status: "success", user: user });
      });
    })(req, res, next);
  }),
];

exports.user_sign_out = asyncHandler(async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.json({ status: "success", user: req.user });
  });
});

exports.sign_up_post = [
  body("name")
    .trim()
    .exists()
    .withMessage("You must Enter a first name")
    .isLength({ min: 3 })
    .withMessage("name has to be atleast 3 characters long"),
  body("username")
    .trim()
    .exists()
    .withMessage("You must Enter a username")
    .isLength({ min: 3 })
    .withMessage("Username has to be atleast 3 characters long")
    .custom(async (value) => {
      const user = await User.findOne({ user_name: value }).exec();
      if (user) {
        throw new Error("Username already in use");
      }
    }),
  body("password")
    .trim()
    .exists()
    .withMessage("You must enter a password")
    .isStrongPassword({
      minLength: 8,
    })
    .withMessage("Password must be atleast 8 charaters."),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const user = new User({
      name: req.body.name,
      user_name: req.body.username,
      password: await HashedPassword(req.body.password),
    });
    if (!errors.isEmpty()) {
      res.json({
        status: "failed",
        user: user,
        errors: errors.array(),
      });
      return;
    } else {
      await user.save();
      res.json({ status: "success", user: user });
    }
  }),
];
