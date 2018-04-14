const cp = require('child_process'); // 子进程
const { resolve } = require('path');

;(async () => {
    // 提取脚本
    const script = resolve(__dirname, '../crawler/video.js');
    const child = cp.fork(script, []);
    let invoked = false; // 进程是否开启 标示符

    // 监听进程异常
    child.on('error', err => {
        if (invoked) return;

        invoked = true;

        console.log(err);
    });

    // 监听进程退出
    child.on('exit', code => {
        if (invoked) return;

        invoked = true;
        let err = code === 0 ? null : new Error('exit code ' + code);

        console.log(err);
    });

    // 监听进程传过的信息
    child.on('message', data => {
        console.log(data);
    });
})();