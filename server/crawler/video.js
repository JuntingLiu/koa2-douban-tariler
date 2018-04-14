const puppeteer = require('puppeteer'); // 无头浏览器器

const base = `https://movie.douban.com/subject/`;
const doubanId = '26670671';
const videoBase = `https://movie.douban.com/trailer/229523`;
// promise 定时函数
const sleep = time => new Promise((resolve, reject) => {
    setTimeout(resolve, time);
});

;(async () => {
    console.log('Start visit the target page.');
    // 模拟用户操作浏览器
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'], // 非沙箱模式
        dumpio: false
    });

    const page = await browser.newPage(); // 开启新页面
    await page.goto(base + doubanId, {
        waitUntil: 'networkidle2'    // 网络空闲的时候，加载完毕
    });

    await sleep(1000); // 等待 1s

    const result = await page.evaluate(() => {
        var $ = window.$; // 豆瓣使用了 jquery；所以我们可以用 $ 来操作
        var it = $('.related-pic-video');

        if (it && it.length > 0) {
            var link = it.attr('href');
            var cover = it.find('img').attr('src');

            return {
                link,
                cover
            }
        }
        return {}; // 没有预告片，返回控对象
    });

    let video;

    if (result.link) {
        await page.goto(result.link, {
            waitUntil: 'networkidle2'
        });

        await sleep(2000);

        video = await page.evaluate(() => {
            var $ = window.$;
            var it = $('source');

            if (it && it.length > 0) {
                return it.attr('src');
            }

            return '';
        });
    }

    const data = {
        doubanId,
        cover: result.cover,
        video
    }
    
    browser.close();
    
    process.send(data);
    process.exit(0);
})();

