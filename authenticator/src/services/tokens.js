const jwt = require('jsonwebtoken');
const {handleResponse} = require('../helpers');
const {JWT_SECRET} = process.env;
const CustomErrorResponse = require('../errors/customErrorResponse');


const generateToken = (user) => new Promise((resolve, reject) => {
  jwt.sign(
      {
        username: user.username,
        hashedEmail: user.hashedEmail,
        verified: user.verified,
      },
      JWT_SECRET,
      {expiresIn: '2h'},
      (err, tokenResult) => (err ? reject(err) : resolve(tokenResult)),
  );
});

const checkToken = async (ctx) => {
  try {
    const token = ctx.request.headers.authorization.split(' ')[1];
    await jwt.verify(
      token,
      JWT_SECRET,
      async (error, authData) => {
        if (error) {
          throw new CustomErrorResponse(403, 'Authentication failed');
        } else {
          console.log(authData);
          handleResponse(ctx)(200, null);
        }
      },
    );
  } catch (err) {
    handleResponse(ctx)(403, null);
    return;
  }
};


module.exports = { generateToken, checkToken };