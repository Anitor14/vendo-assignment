const createTokenUser = (user) => {
  return {
    firstname: user.firstname,
    lastname: user.lastname,
    userId: user._id,
  };
};

module.exports = createTokenUser;
