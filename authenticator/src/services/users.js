const {User} = require('./connection');
const {handleResponse} = require('../helpers');


const handleUserAlreadyExists = (ctx) = async (user) => {
  let users = await User.findAll({
    where: {
      username: user.username,
    },
  });
  if (users.length > 0) {
    handleResponse(ctx)(409, {
      message: 'Email address or username already exist',
    });
    return;
  };
  users = await User.findAll({
    where: {
      email: user.email,
    },
  });
  if (users.length > 0) {
    handleResponse(ctx)(409, {
      message: 'Email address or username already exist',
    });
    return;
  };
  return;
};

const handleUserLogIn = (ctx) = async (receivedUser) => {
  const user = await User.findOne({
    where: {
      username: receivedUser.username,
    },
  });
  if (!user) {
    handleResponse(ctx)(403, {
      message: 'Username or password is incorrect',
    });
    return;
  }
  return user;
}


module.exports = { handleUserAlreadyExists, handleUserLogIn };