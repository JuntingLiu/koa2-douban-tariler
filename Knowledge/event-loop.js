const { readFile, readFileSync } =  require("fs");

setImmediate(() => console.log('[阶段3.immediate] immediate 回调 1'));
setImmediate(() => console.log('[阶段3.immediate] immediate 回调 2'));
setImmediate(() => console.log('[阶段3.immediate] immediate 回调 3'));

Promise.resolve()
    .then(() => {
        console.log('[...带切入下一个阶段] promise 回调 1');

        setImmediate(() => console.log('[阶段3.immediate] promise 回调1 增加 immediate 回调 4'));
    });

readFile('../package.json', 'utf-8', data => {
    console.log('[阶段2.IO] 读文件 回调 1');

    readFile('../node_modules/koa-compose/Readme.md', 'utf-8', data => {
        console.log('[阶段2.IO] 读文件 回调 2');
    });

    setImmediate(() => {
        console.log('[阶段3.immediate] 读文件 回调 2 增加 immediate 回调 5')
        
        Promise.resolve()
            .then(() => {
                console.log('[...带切入下一个阶段] promise 回调 2');

                process.nextTick(() => console.log('[...带切入下一个阶段] promise 回调2 增加 nextTick 回调 6'));
            })
            .then(() => {
                console.log('[...带切入下一个阶段] promise 回调 3');
            });
    });
});


// 定时器，有个检测阶段，0毫秒也有可能一下不能到期 
setTimeout(() => console.log('[阶段1...定时器] 定时器 回调 1'), 0);
setTimeout(() => {
    console.log('[阶段1...定时器] 定时器 回调 2');

    process.nextTick(() => {
        console.log('[...带切入下一个阶段] nextTick 回调 5');
    });
}, 0);

setTimeout(() => console.log('[阶段1...定时器] 定时器 回调 3'), 0);
setTimeout(() => console.log('[阶段1...定时器] 定时器 回调 4'), 0);

process.nextTick(() => console.log('[...带切入下一个阶段] nextTick 回调 1'));
process.nextTick(() => {
    console.log('[...带切入下一个阶段] nextTick 回调 2');

    process.nextTick(() => {
        console.log('[...带切入下一个阶段] nextTick 回调 4');
    });
});
process.nextTick(() => console.log('[...带切入下一个阶段] nextTick 回调 3'));
