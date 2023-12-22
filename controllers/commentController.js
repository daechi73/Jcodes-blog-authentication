const asyncHandler = require("express-async-handler");
const Comment = require("../models/comment");

exports.comment_list = asyncHandler(async (req, res, next) => {
  const comment = await Comment.find().exec();
  if (comment.length === 0) res.send("No Comments Found");
  res.send(comment);
});
exports.comment_post = [asyncHandler(async (req, res, next) => {})];
