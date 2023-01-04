const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const crypto = require("crypto");

const register = async (req, res) => {
  const { firstname, lastname, email, password, referredCode } = req.body;

  const emailAlreadyExists = await User.findOne({ email });

  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError("Email already exists");
  }

  // const isFirstAccount = (await User.countDocuments({})) === 0; //check if there is any accounts.

  const isFirstAccount = (await User.countDocuments({})) === 0; // checking for the first account.

  const referralCode = crypto.randomBytes(3).toString("hex");

  // if the user registers with a referred code we check if the code exists.

  if (!isFirstAccount) {
    if (!referredCode) {
      throw new BadRequestError("please input a Referral Code.");
    }
    const existingReferralCode = await User.findOne({
      referralCode: referredCode,
    });

    if (!existingReferralCode) {
      throw new CustomError.BadRequestError(
        "please input a valid Referral Code"
      );
    }
  }
  //creating the user.
  const user = await User.create({
    ...req.body,
    referralCode,
  });

  res.status(StatusCodes.CREATED).json({ user });
};

const login = async (req, res) => {
  res.send("this is the login controller");
};

const logout = async (req, res) => {
  res.send("this is the logout controller");
};

module.exports = {
  register,
  login,
  logout,
};
