const mongoose = require('mongoose');
const glob = require('glob'); // 允许使用*匹配符号，创建规则
const { resolve } = require('path');
const db = 'mongodb://localhost/koa2-douban-tariler';
mongoose.Promise = global.Promise;

exports.initSchemas = () => {
    // 同步拿到所有的schema
    glob.sync(resolve(__dirname, './schema/', '**/*.js')).forEach(require);
};

exports.connect = () => {
    let maxConnectTimes = 0;

    return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV !== 'production') {
            mongoose.set('debug', true);
        }
    
        mongoose.connect(db);
    
        // 断开连接
        mongoose.connection.on('disconnected', () => {
           maxConnectTimes++;
           if (maxConnectTimes < 5) {
                mongoose.connect(db);
           } 
           else {
               throw new Error('数据库挂了，快去修吧～骚年');
           }
        });
        // 报错
        mongoose.connection.on('error', err => {
            if (maxConnectTimes < 5) {
                mongoose.connect(db);
           } 
           else {
               throw new Error('数据库挂了，快去修吧～骚年');
           }
        });
        // 连接成功
        mongoose.connection.on('open', () => {
            console.log('MongoDB Connected successfully!');
            // 测试数据库连接正常
            // const Dog = mongoose.model('Dog', {name: String});
            // const doga = new Dog({ name: '阿尔法' });

            // doga.save().then(() => {
            //     console.info('wang');
            // });
            resolve();
        });
    
    }); 

};