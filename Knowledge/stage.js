const { readFile } = require('fs');
const EventEmitter = require('events');

class EE extends EventEmitter {}

const yy = new EE();

// 监听 event 事件，触发执行
yy.on('event', () => {
    console.log('出大事了！');
});

// 执行顺序 6
setTimeout(() => {
    console.log('0 毫秒后到期执行的定时器回调');
}, 0);

// 执行顺序 10
setTimeout(() => {
    console.log('100 毫秒后到期执行的定时器回调');
}, 100);

// 执行顺序 11
setTimeout(() => {
    console.log('200 毫秒后到期执行的定时器回调');
}, 200);

// 执行顺序 7
readFile('../package.json', 'utf-8', data => {
    console.log('完成文件 1 读操作的回调');
});

// 执行顺序 8
readFile('../Readme', 'utf-8', data => {
    console.log('完成文件 2 读操作的回调');
});

// 执行顺序 9
setImmediate(() => {
    console.log('immediate 立即回调');
});

// 执行顺序 1
process.nextTick(() => {
    console.log('process.nextTick 的第 1 次回调');
});


Promise.resolve()
    .then(() => {
        yy.emit('event'); // 执行顺序 2

        // 执行顺序 5
        process.nextTick(() => {
            console.log('process.nextTick 的第 2 次回调');
        });

        console.log('Promise 的第 1 次回调'); // 执行顺序 3
    })
    .then(() => {
        console.log('Promise 的第 1 次回调'); // 执行顺序 4
    });


// 以上代码的执行都是在异步队列里

// 1. process.nextTick() 的优先级
// 2. libuv
// 3. EventEmitter