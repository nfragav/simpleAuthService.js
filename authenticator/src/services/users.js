const {User} = require('./dbConnection');
const CustomErrorResponse = require('../errors/customErrorResponse');
const encryptionService = require('./encryption');
const { Op } = require('sequelize');


const handleUserAlreadyExists = async (receivedUser) => {
  console.log("Received user for verifying existence:", receivedUser);
  const user = await User.findOne({
    where: {
      [Op.or]: [
        { username: receivedUser.username || '' },
        { hashedEmail: receivedUser.hashedEmail || '' }
      ]
    },
  });
  if (user) {
    throw new CustomErrorResponse(409, 'User already exists');
  };
  return;
};

const handleUserLogIn = async (receivedUser) => {
  const { usernameOrEmail, password } = receivedUser;

  const user = await User.findOne({
    where: {
      [Op.or]: [
        { username: usernameOrEmail || '' },
        { hashedEmail: encryptionService.hashEmail(usernameOrEmail) || '' }
      ]
    },
  });

  if (!user) {
    console.log("User not found!");
    throw new CustomErrorResponse(403, 'Username or password is incorrect');
  }

  await encryptionService.comparePassword(password, user.password);

  return user;
}


module.exports = { handleUserAlreadyExists, handleUserLogIn };