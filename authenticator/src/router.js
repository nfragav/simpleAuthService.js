const KoaRouter = require('koa-router');
const jwt = require('jsonwebtoken');
const {User} = require('./connection');

const {JWT_SECRET} = process.env;
const {
  generateToken,
  checkForToken,
  userAlreadyExists,
  handleResponse,
} = require('./helpers');

const router = new KoaRouter();

router.post('verify', '/verify', async (ctx, next) => {
  const token = checkForToken(ctx);
  await jwt.verify(
      token,
      JWT_SECRET,
      async (error, authData) => {
        if (error) {
          handleResponse(ctx)(403, {mesage: error});
        } else {
          console.log(authData);
          handleResponse(ctx)(200, null);
        }
      },
  );
})

    .post('user.create', '/users', async (ctx, next) => {
      const userParams = ctx.request.body;
      const existingUserData = await userAlreadyExists(userParams);
      if (existingUserData) {
        handleResponse(ctx)(409, {
          message: 'Email address or Username already exist',
        });
      } else {
        const user = await User.create(userParams);
        const token = await generateToken(user);
        handleResponse(ctx)(201, {
          user: {
            username: user.username,
            email: user.email,
          },
          token: {
            access_token: token,
            token_type: 'Bearer',
          },
        });
      }
    })

    .post('login', '/login', async (ctx) => {
      try {
        const userParams = ctx.request.body;
        const user = await User.findOne({
          where: {
            username: userParams.username,
          },
        });
        if (!user) {
          handleResponse(ctx)(403, {
            message: `No username matching ${userParams.username}`,
          });
          return;
        }
        if (user.password !== userParams.password) {
          handleResponse(ctx)(401, {
            message: 'Password mismatch',
          });
          return;
        }
        const token = await generateToken(user);
        handleResponse(ctx)(201, {
          user: {
            username: user.username,
            email: user.email,
          },
          token: {
            access_token: token,
            token_type: 'Bearer',
          },
        });
      } catch (err) {
        handleResponse(ctx)(500, {
          message: 'Internal Server Error',
        });
      }
    });

module.exports = {router};
