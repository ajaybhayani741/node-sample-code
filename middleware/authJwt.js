const jwt = require("jsonwebtoken");
const config = require("../config/index.js");
const db = require("../models");
const responseMessage = require('../config/messages');
const responseService = require('../helper/response');
const User = db.user;

verifyToken = async (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return await responseService.failure(res, responseMessage.tokenNotProvided, "", "Failure")
  }

  jwt.verify(token, config.secret, async (err, decoded) => {
    if (err) {
      return await responseService.failure(res, responseMessage.Unauthorized, "", "Failure")
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Admin Role!"
      });
      return;
    });
  });
};

isSalesman = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "salesman") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Moderator Role!"
      });
    });
  });
};

isSalesmanOrAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "salesman") {
          next();
          return;
        }

        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Salesman or Admin Role!"
      });
    });
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isSalesman: isSalesman,
  isSalesmanOrAdmin: isSalesmanOrAdmin
};
module.exports = authJwt;
