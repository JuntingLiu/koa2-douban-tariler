const puppeteer = require('puppeteer'); // 无头浏览器器

const url = `https://movie.douban.com/tag/#/?sort=R&range=0,10&tags=`;
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
    await page.goto(url, {
        waitUntil: 'networkidle2'    // 网络空闲的时候，加载完毕
    });

    await sleep(3000); // 等待 3s
    
    // 等待加载更多按钮出现为止
    await page.waitForSelector('.more');
    // 点击加载更多按钮，i 爬取几页数据
    for (let i = 0; i < 1; i++) {
        await sleep(3000);
        await page.click('.more');
    }

    const result = await page.evaluate(() => {
        var $ = window.$; // 豆瓣使用了 jquery；所以我们可以用 $ 来操作
        var items = $('.list-wp a'); // 电影列表容器
        var links = [];

        if (items.length >= 1) {
            items.each((index, item) => {
                // 提取电影相关信息
                let it = $(item);
                let doubanId = it.find('div').data('id');
                let title = it.find('.title').text();
                let rate = Number(it.find('.rate').text());
                let poster = it.find('img').attr('src').replace('s_ratio', 'l_ratio');

                links.push({
                    doubanId,
                    title,
                    rate,
                    poster
                });
            });
        }

        return links;
    });

    browser.close();
    console.log(result);
})();

