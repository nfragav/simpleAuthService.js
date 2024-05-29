const KoaRouter = require('koa-router');
const {User} = require('./connection');
const {handleResponse} = require('./helpers');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const tokensService = require('./services/tokens');
const usersService = require('./services/users');
const encryptionService = require('./services/encryption');

const router = new KoaRouter();

router.post('verify', '/verify', async (ctx, next) => {
  try {
    await tokensService.checkToken(ctx);
  } catch (err) {
    next(ctx, err);
  }
})

  .post('users.create', '/users', async (ctx, next) => {
    try {
      const userParams = ctx.request.body;
      await encryptionService.hashPasswordInPlace(userParams);
      await usersService.handleUserAlreadyExists(ctx)(userParams);
      const {username, email, verified} = await User.create(userParams);
      const token = await tokensService.generateToken({
        username,
        email,
        verified
      });
      handleResponse(ctx)(201, {
        token: {
          access_token: token,
          token_type: 'Bearer',
        },
      });
    } catch (err) {
      next(ctx, err);
    }
  })

  .post('login', '/login', async (ctx) => {
    try {
      const user = await usersService.handleUserLogIn(ctx)(ctx.request.body);
      await encryptionService.comparePassword(ctx)(password, user.password);
      const token = await tokensService.generateToken(user);
      handleResponse(ctx)(201, {
        token: {
          access_token: token,
          token_type: 'Bearer',
        },
      });
    } catch (err) {
      next(ctx, err);
    }
  })

  .use(ctx, error => {
    console.error(error);
    handleResponse(ctx)(500, {
      message: 'Internal Server Error',
    });
  });

module.exports = {router};
