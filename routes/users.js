var express = require("express");
var router = express.Router();

var userController = require("../controllers/userController");

/* GET users listing. */
router.get("/", userController.users_get);
router.post("/sign-up", userController.user_sign_in);
router.get("/sign-out", userController.user_sign_out);
router.post("/sign-up", userController.user_sign_up);
router.get("/:id", userController.user_detail);

module.exports = router;
