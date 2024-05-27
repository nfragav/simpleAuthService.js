const KoaRouter = require('koa-router');
const jwt = require('jsonwebtoken');
const {User} = require('./connection');
const bcrypt = require('bcryptjs');
const {JWT_SECRET, SALT_ROUNDS} = process.env;
const {
  generateToken,
  checkForToken,
  userAlreadyExists,
  handleResponse,
} = require('./helpers');

const saltRounds = parseInt(SALT_ROUNDS);
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
        return;
      }
      const hashPassword = await bcrypt.hash(userParams.password, saltRounds);
      userParams.password = hashPassword;
      const {id, username, email, verified} = await User.create(userParams);
      const token = await generateToken({id, username, email, verified});
      handleResponse(ctx)(201, {
        user: {username, email},
        token: {
          access_token: token,
          token_type: 'Bearer',
        },
      });
    })

    .post('login', '/login', async (ctx) => {
      try {
        const {username, password} = ctx.request.body;
        console.log("Users:", users)
        const user = await User.findOne({
          where: {
            username,
          },
        });
        if (!user) {
          handleResponse(ctx)(403, {
            message: 'Username or password is incorrect',
          });
          return;
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          handleResponse(ctx)(401, {
            message: 'Username or password is incorrect',
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
        console.error(err);
        handleResponse(ctx)(500, {
          message: 'Internal Server Error',
        });
      }
    });

module.exports = {router};
