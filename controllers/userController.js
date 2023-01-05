const User = require("../models/User");
const { statusCodes, StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const showCurrentUser = async (req, res) => {
  //   res.send("this is the showCurrent User");
  res.status(StatusCodes.OK).json({ user: req.user });
};

const showDirectReferrals = async (req, res) => {
  class Node {
    constructor(data) {
      this.data = data;
      this.children = [];
    }
    add(data) {
      this.children.push(new Node(data));
    }
  }
  const user = await User.findOne({ _id: req.user.userId }).select("-password");
  const node = new Node(user);

  const addChildrenToNode = async (user) => {
    const referralCode = user.referralCode;

    const referredUsers = await User.find({
      referredCode: referralCode,
    }).select("-password");
    console.log(referredUsers.length);

    referredUsers.map((referredUser) => {
      console.log(referredUser);
      node.add(referredUser);
      addChildrenToNode(referredUser);
    });
  };
  await addChildrenToNode(user);
  res.status(StatusCodes.OK).json({ node });
};

module.exports = {
  showCurrentUser,
  showDirectReferrals,
};
