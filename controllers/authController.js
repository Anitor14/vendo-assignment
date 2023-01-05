const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { createTokenUser, attachCookiesToResponse } = require("../utils");

const crypto = require("crypto");

const register = async (req, res) => {
  const { firstname, lastname, email, password, referredCode } = req.body;

  const emailAlreadyExists = await User.findOne({ email });

  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError("Email already exists");
  }

  // const isFirstAccount = (await User.countDocuments({})) === 0; // checking for the first account.

  const referralCode = crypto.randomBytes(3).toString("hex");

  // if the user registers with a referred code we check if the code exists.

  // if (!referredCode) {
  //   throw new CustomError.BadRequestError("please input a Referred Code.");
  // }
  if (!referralCode == null) {
    const existingReferralCode = await User.findOne({
      referralCode: referredCode,
    });

    if (!existingReferralCode) {
      throw new CustomError.BadRequestError(
        "please input a valid Referred Code"
      );
    }
  }

  //creating the user.
  const user = await User.create({
    ...req.body,
    referralCode,
  });

  // creating a token user.
  const tokenUser = createTokenUser(user);

  //attaching the cookies to response
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid credentials");
  }

  //compare password using the comparePassword instance method.
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }

  // creating a tokenUser from the user.
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out" });
};

module.exports = {
  register,
  login,
  logout,
};
