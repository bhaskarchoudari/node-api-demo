require('dotenv').config();
//process.env.INFURA_URL
const koa = require('koa');
const app = new koa();
const router = require('./router');

app.use(router.routes());

app.listen(3000);