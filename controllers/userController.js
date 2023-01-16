const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const showCurrentUser = async (req, res) => {
  //   res.send("this is the showCurrent User");
  res.status(StatusCodes.OK).json({ user: req.user });
};

const showReferrals = async (req, res) => {
  class Node {
    constructor(data) {
      this.data = data;
      this.children = [];
    }
    add(data) {
      // this.children.push(new Node(data));
      this.children.push(data);
    }
  }

  const user = await User.findOne({ _id: req.user.userId }).select("-password");
  const node = new Node(user);

  const addChildrenToNode = async (user, node) => {
    const referralCode = user.referralCode;

    const referredUsers = await User.find({
      referredCode: referralCode,
    }).select("-password");
    console.log(referredUsers.length);
    // if (referredUsers.length == 0) {
    //   return;
    // }

    await Promise.all(
      referredUsers.map(async (referredUser) => {
        const newNode = new Node(referredUser); // create a new node.
        node.add(newNode); // add the newNode to the node.
        console.log(referredUser);
        await addChildrenToNode(referredUser, newNode); // the recursive function.
      })
    );

    // await Promise.all(
    //   referredUsers.map(async (referredUser) => {
    //     await addChildrenToNode(referredUser);
    //   })
    // );
    // return node;
  };

  await addChildrenToNode(user, node);
  res.status(StatusCodes.OK).json({ node });
};

module.exports = {
  showCurrentUser,
  showReferrals,
};
