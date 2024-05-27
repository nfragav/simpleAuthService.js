const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');

const {PORT} = process.env;

const app = new Koa();

app.use(bodyParser());
app.use(cors({
  origin: '*',
}));

const {router} = require('./router');
app.use(router.routes()).use(router.allowedMethods());
app.listen(PORT, () => console.log(`Server started on port ${PORT}...`));
