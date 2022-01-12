const authService = require("../services/auth.service");

exports.signUp = async (req, res) => {
  return await authService.signUpUser(req, res, req.body);
};

exports.signIn = async (req, res) => {
  return await authService.signInUser(req, res, req.body);
};

exports.resetPassword = async (req, res) => {
  return await authService.resetPassword(req, res, req.body);
};

exports.forgetPasswordMail = async (req, res) => {
  return await authService.forgetPasswordMail(req, res, req.body);
};
