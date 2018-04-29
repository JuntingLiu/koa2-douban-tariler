const Koa = require('koa');
const mongoose = require('mongoose');
const views = require('koa-views'); // 模版引擎
const { resolve } = require('path'); // resolve 拼接路径
const { connect, initSchemas, initAdmin } = require('./database/init'); // 数据库连接
// const router = require('./routes');
const R = require('ramda');
const MIDDLEWARES = ['router', 'parcel'];


const useMiddlewares = (app) => {
    R.map(
        R.compose(
            R.forEachObjIndexed(
                initWith => initWith(app)
            ),
            require,
            name => resolve(__dirname, `./middlewares/${name}`) 
        )
    )(MIDDLEWARES);
};

;(async () => {
    await connect();
    
    initSchemas();

    await initAdmin();
    // 检验数据库
    // const Movie = mongoose.model('Movie');
    // const movies = await Movie.find({});
    // console.log(movies);

    // 爬取数据
    // require('./task/movie');
    // require('./task/api');

    const app = new Koa();
    await useMiddlewares(app);

    app.listen(3000, () => {
        console.log('Server is running...');
    });

})();
