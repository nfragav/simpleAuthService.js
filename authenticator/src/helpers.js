const jwt = require('jsonwebtoken');
const {User} = require('./connection');
const {JWT_SECRET} = process.env;


const generateToken = (user) => new Promise((resolve, reject) => {
  jwt.sign(
      {
        sub: user.id,
        verified: user.verified,
      },
      JWT_SECRET,
      {expiresIn: '2h'},
      (err, tokenResult) => (err ? reject(err) : resolve(tokenResult)),
  );
});

const checkForToken = (ctx) => {
  try {
    const bearerHeader = ctx.request.headers.authorization.split(' ')[1];
    return bearerHeader;
  } catch (err) {
    ctx.throw(403);
    return null;
  }
};

const userAlreadyExists = async (user) => {
  let users = await User.findAll({
    where: {
      username: user.username,
    },
  });
  if (users.length > 0) {
    return true;
  }
  users = await User.findAll({
    where: {
      email: user.email,
    },
  });
  if (users.length > 0) {
    return true;
  }
  return false;
};

const handleResponse = (ctx) => (statusCode, body) => {
  ctx.body = body;
  ctx.status = statusCode;
};

module.exports = {
  generateToken,
  checkForToken,
  userAlreadyExists,
  handleResponse,
};
