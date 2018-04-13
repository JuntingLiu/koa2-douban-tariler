const Koa = require('koa');
const app = new Koa();
const { normal } = require('./templates');

app.use(async (ctx, next) => {
    ctx.type = 'text/html;charset=utf-8';
    ctx.body = normal;
});

app.listen(4455, () => {
    console.log('Server is running...');
})