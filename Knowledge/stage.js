const { readFile } = require('fs');
const EventEmitter = require('events');

class EE extends EventEmitter {}

const yy = new EE();

// 监听 event 事件，触发执行
yy.on('event', () => {
    console.log('出大事了！');
});

// 执行顺序 6 timers阶段
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

// 执行顺序 7 poll 阶段
readFile('../package.json', 'utf-8', data => {
    console.log('完成文件 1 读操作的回调');
});

// 执行顺序 8
readFile('../Readme', 'utf-8', data => {
    console.log('完成文件 2 读操作的回调');
});

// 执行顺序 9 check 阶段
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

        // 执行顺序 5; 执行到这里，先回等Promise 这个队列先执行完毕再回来立即执行
        process.nextTick(() => {
            console.log('process.nextTick 的第 2 次回调');
        });

        console.log('Promise 的第 1 次回调'); // 执行顺序 3
    })
    .then(() => {
        console.log('Promise 的第 1 次回调'); // 执行顺序 4
    });


// 以上代码的执行都是在异步队列里

// 1. process.nextTick() 的优先级最高
//    方法将 callback 添加到"next tick 队列"。 一旦当前事件轮询队列的任务全部完成，在next tick队列中的所有callbacks会被依次调用.每次事件轮询后，在额外的I/O执行前，next tick队列都会优先执行。 递归调用nextTick callbacks 会阻塞任何I/O操作，就像一个while(true); 循环一样。
// 2. libuv
// 3. EventEmitter

// process.nextTick > Promise 先把这两个先执行完
// 文档说明： https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/
// 事件处理机制，对应 Node.js 源码 libuv/src/unix/core.c  348行
// timers -> uv_run_timers() 定时器、setTimeout...
// I/O callbacks -> uv_run_pending()  处理系统错误、TCP\UDP、socket...
// idle, prepare -> uv_run_idle() uv_run_prepare() 
// poll -> uv_io_poll() 轮询阶段，向系统去获取新的I/O事件，执行对应的I/O回调；
// 首先处理到期的 timers 的回调，然后处理 poll 队列里的回调；直到队列中的回调全部被清空或者达到处理上线，如果不为空，又有 setImmediate  回调，终止poll阶段，执行 check 阶段 执行 setImmediate; 如果没有就会检测有没有定时器任务到期了，有 就前往 timers 阶段执行；poll 阶段后，就到了check 阶段， setImmediate 只能在 check 阶段执行； 最后是 close callback。
// 每个阶段都是一个独立的阶段，每个阶段都有先进先出的队列。每个阶段的 callback 都执行完才会执行下一个阶段； 执行顺序是依次的，但是外部会有触发的机制。