const {
  authJwt
} = require("../middleware");
const controller = require("../controllers/user.controller");
var express = require('express');
var router = express.Router();

router.get("/all", controller.allAccess);

router.get("/client", [authJwt.verifyToken], controller.userBoard);

router.get("/salesman", [authJwt.verifyToken, authJwt.isSalesman], controller.moderatorBoard);

router.get("/admin", [authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard);

module.exports = router