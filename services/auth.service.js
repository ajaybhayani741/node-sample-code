const moment = require("moment");
const db = require("../models");
const config = require("../config/index");

const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

const responseMessage = require("../config/messages");
const responseService = require("../helper/response");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

var mailHelper = require("./../helper/mail");

exports.signUpUser = async (req, res) => {
  
  const data = req.body;

  const user = await User.create({
    firstName: data.firstName,
    lastName: data.lastName,
    companyName: data.companyName,
    country_code: data.country_code,
    phone: data.phone,
    folder: data.folder,
    facebook: data.facebook,
    instagram: data.instagram,
    linkedin: data.linkedin,
    twitter: data.twitter,
    picture: data.picture,
    username: data.username,
    email: data.email,
    password: bcrypt.hashSync(data.password, 8),
  });

  if (user) {
    if (data.roles) {
      const roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: data.roles,
          },
        },
      });
      if (roles) {
        const newUser = await user.setRoles(roles);
        if (newUser) {
          return await responseService.success(
            res,
            responseMessage.registerSuccess,
            newUser,
            "success"
          );
        }
      }
    } else {
      // user role = 1
      const newUser = await user.setRoles([1]);
      if (newUser) {
        return await responseService.success(
          res,
          responseMessage.registerSuccess,
          newUser,
          "success"
        );
      }
    }
  } else {
    return await responseService.failure(
      res,
      responseMessage.registerFailed,
      user,
      "Failure"
    );
  }
};

exports.signInUser = async (req, res, data) => {
  const user = await User.findOne({
    where: {
      username: data.username,
    },
  });

  if (!user) {
    return await responseService.failure(
      res,
      responseMessage.userNotFound,
      "",
      "Failure"
    );
  } else {
    var passwordIsValid = bcrypt.compareSync(data.password, user.password);

    if (!passwordIsValid) {
      return await responseService.failure(
        res,
        responseMessage.invalidCredentials,
        "",
        "Failure"
      );
    }

    var token = jwt.sign(
      {
        id: user.id,
      },
      config.secret,
      {
        expiresIn: 86400, // 24 hours
      }
    );

    var authorities = [];
    user.getRoles().then(async (roles) => {
      for (let i = 0; i < roles.length; i++) {
        authorities.push("ROLE_" + roles[i].name.toUpperCase());
      }
      let data = {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token,
      };
      return await responseService.success(
        res,
        responseMessage.loginSuccess,
        data,
        "Success"
      );
    });
  }
};

exports.resetPassword = async (req, res, data) => {
  var token = req.headers["x-access-token"];

  if (!token) {
    return await responseService.failure(
      res,
      responseMessage.tokenNotProvided,
      "",
      "Failure"
    );
  } else {
    var decoded = jwt.verify(token, config.secret);

    const user = await User.findOne({
      where: {
        id: decoded.id,
      },
    });

    if (user) {
      if (!bcrypt.compareSync(data.oldPassword, user.password)) {
        return await responseService.failure(
          res,
          "Old password doesn't match",
          "",
          "Failure"
        );
      } else {
        if (data.newPassword === data.conformPassword) {
          try {
            const result = await User.update(
              {
                password: bcrypt.hashSync(data.newPassword, 8),
              },
              {
                where: {
                  id: decoded.id,
                },
              }
            );
            if (result == 1) {
              return await responseService.success(
                res,
                "Password updated successfully",
                data,
                "Success"
              );
            }
          } catch (err) {
            return await responseService.failure(res, err, "", "Failure");
          }
        } else {
          return await responseService.failure(
            res,
            "password and conform password should be match",
            "",
            "Failure"
          );
        }
      }
    }
  }
};

exports.forgetPasswordMail = async (req, res, data) => {
  const user = await User.findOne({
    where: {
      email: data.email,
    },
  });

  if (user) {
    mailHelper.send("forget_password", function (err, res) {
      if (err) {
        console.log("Mail Error:", err);
      } else {
        console.log("Mail Success:", res);
      }
    });
    return await responseService.success(
      res,
      responseMessage.checkEmailToResetPassword,
      data,
      "Success"
    );
  } else {
    return await responseService.success(
      res,
      responseMessage.EmailNotFoundForResetPassword,
      data,
      "Failure"
    );
  }
};
