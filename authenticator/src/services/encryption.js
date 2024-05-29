const bcrypt = require('bcryptjs');
const crypto = require('node:crypto');
const saltRounds = parseInt(process.env.SALT_ROUNDS);


const hashPasswordInPlace = async (user) => {
  user.password = await bcrypt.hash(user.password, saltRounds);
}

const comparePassword = (ctx) = async (password, hash) => {
  const passwordMatch = bcrypt.compare(password, hash);
  if (!passwordMatch) {
    handleResponse(ctx)(401, {
      message: 'Username or password is incorrect',
    });
    return;
  }
}


module.exports = { hashPasswordInPlace, comparePassword };