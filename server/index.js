const Koa = require('koa');
const app = new Koa();
// 模版引擎
const ejs = require('ejs');
const pug = require('pug');

const { htmlTpl, ejsTpl, pugTpl } = require('./templates');

app.use(async (ctx, next) => {
    ctx.type = 'text/html;charset=utf-8';
    ctx.body = pug.render(pugTpl, {
        you: 'Junting',
        me: 'Liu'
    });
});

app.listen(4455, () => {
    console.log('Server is running...');
})