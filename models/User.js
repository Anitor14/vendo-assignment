const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "Please provide your first name"],
    minlength: 3,
    maxlength: 50,
  },
  lastname: {
    type: String,
    required: [true, "Please provide your last name"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide valid email",
    },
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
  },
  referralCode: {
    type: String,
    required: true,
    unique: true,
  },
  referredCode: {
    type: String,
  },
  level: {
    type: Number,
  },
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return; // we are returning cause we don't want to hash the password again if it is not being modified.
  const salt = await bcrypt.genSalt(10); // generate random bytes.
  this.password = await bcrypt.hash(this.password, salt); //hashing the password with the salt.
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
