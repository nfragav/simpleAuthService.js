const bcrypt = require('bcryptjs');
const crypto = require('node:crypto');
const CustomErrorResponse = require('../errors/customErrorResponse');

const saltRounds = 10;

// const usernameSecret = process.env.USERNAME_SECRET;
// const usernameCryptoAlgorithm = process.env.USERNAME_CRYPTO_ALGORITHM;
// const emailSecret = process.env.EMAIL_SECRET;
// const emailCryptoAlgorithm = process.env.EMAIL_CRYPTO_ALGORITHM;
// const saltRounds = parseInt(process.env.PASSWORD_SALT_ROUNDS);
// const hash


const hashPasswordInPlace = async (user) => {
  console.log("Hashing user info:", user);
  user.password = await bcrypt.hash(user.password, saltRounds);
}

const comparePassword = (password, hash) => {
  const passwordMatch = bcrypt.compare(password, hash);
  if (!passwordMatch) {
    throw new CustomErrorResponse(401, 'Username or password is incorrect');
  }
}


module.exports = { hashPasswordInPlace, comparePassword };