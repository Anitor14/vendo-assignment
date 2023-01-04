const User = require("../models/User");
const { statusCodes, StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const showCurrentUser = async (req, res) => {
  res.send("this is the showCurrent User");
};

const showDirectReferrals = async (req, res) => {
  res.send("this is to show the direct referrals");
};

module.exports = {
  showCurrentUser,
  showDirectReferrals,
};
