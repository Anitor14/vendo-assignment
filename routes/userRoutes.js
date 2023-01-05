const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");

const {
  showCurrentUser,
  showDirectReferrals,
} = require("../controllers/userController");

router.route("/showMe").get(authenticateUser, showCurrentUser);
router.route("/showDirectReferrals").get(authenticateUser, showDirectReferrals);
    
module.exports = router;
