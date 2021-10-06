const {
  verifySignUp
} = require("../middleware");
const controller = require("../controllers/auth.controller");
var express = require('express');
var router = express.Router();

router.post("/signup", [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted], controller.signup);
router.post("/signin", controller.signin);
router.post("/forgetPassword", controller.forgetPasswordMail);
router.post("/resetPassword", controller.resetPassword);

module.exports = router