const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");

const {
  showCurrentUser,
  showReferrals,
} = require("../controllers/userController");

router.route("/showMe").get(authenticateUser, showCurrentUser);
router.route("/showDirectReferrals").get(authenticateUser, showReferrals);

module.exports = router;
