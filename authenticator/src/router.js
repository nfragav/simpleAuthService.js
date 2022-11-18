const KoaRouter = require('koa-router');
const jwt = require('jsonwebtoken');
const {User} = require('./connection');

const {JWT_SECRET} = process.env;
const {
  generateToken,
  checkForToken,
  emailExists,
  usernameExists,
} = require('./helpers');

const router = new KoaRouter();

router.get('verify', '/verify', async (ctx, next) => {
  const token = checkForToken(ctx);
  await jwt.verify(
      token,
      JWT_SECRET,
      async (error, authData) => {
        if (error) {
          ctx.status = 403;
          ctx.body = {
            message: error,
          };
        } else {
          ctx.throw(200);
        }
      },
  );
})

    .post('user.create', '/users', async (ctx, next) => {
      const userParams = ctx.request.body;
      const existingEmail = await emailExists(userParams);
      const existingUsername = await usernameExists(userParams);
      if (existingEmail || existingUsername) {
        ctx.status = 409;
        ctx.body = {
          message: 'Email address or Username already exist',
        };
      } else {
        const user = await User.create(userParams);
        const token = await generateToken(user);
        ctx.status = 201;
        ctx.body = {
          token: {
            access_token: token,
            token_type: 'Bearer',
          },
        };
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
        if (user) {
          if (user.password === userParams.password) {
            const token = await generateToken(user);
            ctx.status = 201;
            ctx.body = {
              token: {
                access_token: token,
                token_type: 'Bearer',
              },
            };
          } else {
            ctx.status = 401;
            ctx.body = {
              message: 'Password mismatch',
            };
          }
        } else {
          ctx.status = 403;
          ctx.body = {
            message: `No username matching ${userParams.username}`,
          };
        }
      } catch (err) {
        ctx.status = 500;
        ctx.body = {
          message: `Internal server error: ${err}`,
        };
      }
    });

module.exports = {router};
