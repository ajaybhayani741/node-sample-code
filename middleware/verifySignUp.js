const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;
const responseMessage = require('../config/messages');
const responseService = require('../helper/response');

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    where: {
      username: req.body.username
    }
  }).then( async user => {
    if (user) {
      return await responseService.failure(res, responseMessage.usernameExist, "", "Failure")
    }

    // Email
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(async user => {
      if (user) {
        return await responseService.failure(res, responseMessage.emailExist, "", "Failure")
      }
      next();
    });
  });
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: "Failed! Role does not exist = " + req.body.roles[i]
        });
        return;
      }
    }
  }
  
  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRolesExisted: checkRolesExisted
};

module.exports = verifySignUp;
