const KoaRouter = require('koa-router');
const {User} = require('./connection');
const {handleResponse} = require('./helpers');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const tokensService = require('./services/tokens');
const usersService = require('./services/users');
const encryptionService = require('./services/encryption');
const CustomErrorResponse = require('./errors/customErrorResponse');


const router = new KoaRouter();

router
.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.log("Error catched!");
    console.error(err);
    if (err instanceof CustomErrorResponse) {
      handleResponse(ctx)(err.statusCode, {
        message: err.message,
      });
    } else {
      handleResponse(ctx)(500, {
        message: 'Internal server error',
      });
    }
  }
})

  .post('verify', '/verify', async (ctx, next) => {
    await tokensService.checkToken(ctx);
  })

  .post('users.create', '/users', async (ctx, next) => {
    const userParams = ctx.request.body;
    console.log("Received Params:", userParams);
    await encryptionService.hashPasswordInPlace(userParams);
    console.log("After hashing password:", userParams);
    await usersService.handleUserAlreadyExists(userParams);
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
  })

  .post('login', '/login', async (ctx, next) => {
    console.log(ctx.request.body);
    const user = await usersService.handleUserLogIn(ctx.request.body);
    await encryptionService.comparePassword(ctx.request.body.password, user.password);
    const token = await tokensService.generateToken(user);
    handleResponse(ctx)(201, {
      token: {
        access_token: token,
        token_type: 'Bearer',
      },
    });
  })


module.exports = {router};