const Koa = require('koa');
const app = new Koa();
const views = require('koa-views'); // 模版引擎
const { resolve } = require('path'); // resolve 拼接路径
const { connect } = require('./database/init'); // 数据库连接

;(async () => {
    await connect();
})();

// 启用模版引擎并配置
app.use(views(resolve(__dirname, './views'), {
    extension: 'pug'
}));

app.use(async (ctx, next) => {
    await ctx.render('index', {
        you: 'Koa',
        me: 'Junting'
    })
});

app.listen(3000, () => {
    console.log('Server is running...');
});