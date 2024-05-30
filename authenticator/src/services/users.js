const {User} = require('../connection');
const {comparePassword} = require('./encryption');
const CustomErrorResponse = require('../errors/customErrorResponse');


const handleUserAlreadyExists = async (user) => {
  console.log("Received user:", user);
  let users = await User.findAll({
    where: {
      username: user.username,
    },
  });
  if (users.length > 0) {
    throw new CustomErrorResponse(409, 'User already exists');
  };
  users = await User.findAll({
    where: {
      email: user.email,
    },
  });
  if (users.length > 0) {
    throw new CustomErrorResponse(409, 'User already exists');
  };
  return;
};

const handleUserLogIn = async (receivedUser) => {
  let user = await User.findOne({
    where: {
      username: receivedUser.username,
    },
  });
  if (!user) {
    throw new CustomErrorResponse(403, 'Username or password is incorrect');
  }
  comparePassword(receivedUser.password, user.password);
  return user;
}


module.exports = { handleUserAlreadyExists, handleUserLogIn };