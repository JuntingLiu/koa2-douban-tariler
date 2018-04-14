const req_p = require('request-promise-native');

// Promise 请求函数
async function fetchMovie (item) {
    const url = `http://api.douban.com/v2/movie/subject/${item.doubanId}`;
    const res = await req_p(url);

    return res;
}

;(async () => {
    let movies = [ { doubanId: 26655968,
        title: '全金属狂潮4',
        rate: 9.7,
        poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2507922546.jpg' },
      { doubanId: 26670671,
        title: '迷失太空',
        rate: 6.5,
        poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2515605702.jpg' },
      { doubanId: 30155194,
        title: '我才不会被女孩子欺负呢',
        rate: 6,
        poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2516601610.jpg' },
      { doubanId: 26355355,
        title: '命运石之门0',
        rate: 9.6,
        poster: 'https://img1.doubanio.com/view/photo/l_ratio_poster/public/p2512750889.jpg' },
      { doubanId: 27176635,
        title: '北京女子图鉴',
        rate: 6.8,
        poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2518770940.jpg' },
      { doubanId: 27605548,
        title: '行骗天下JP',
        rate: 7.5,
        poster: 'https://img1.doubanio.com/view/photo/l_ratio_poster/public/p2518837167.jpg' },
      { doubanId: 30167108,
        title: '冒险王卫斯理',
        rate: 4.3,
        poster: 'https://img1.doubanio.com/view/photo/l_ratio_poster/public/p2518230508.jpg' },
      { doubanId: 26915602,
        title: '嗜血娇娃',
        rate: 8.6,
        poster: 'https://img1.doubanio.com/view/photo/l_ratio_poster/public/p2517103319.jpg' },
      { doubanId: 27620552,
        title: '鬼灯的冷彻 第二季 其之二',
        rate: 9.5,
        poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2516585731.jpg' },
      { doubanId: 27160633,
        title: '我的英雄学院 第3季',
        rate: 9.3,
        poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2514154723.jpg' },
      { doubanId: 27101778,
        title: '女神异闻录5',
        rate: 8.9,
        poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2508555193.jpg' },
      { doubanId: 30157139,
        title: '孤独的美食家 第七季',
        rate: 9.6,
        poster: 'https://img1.doubanio.com/view/photo/l_ratio_poster/public/p2518507118.jpg' },
      { doubanId: 30168025,
        title: '林中小屋',
        rate: 9.1,
        poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2518517254.jpg' },
      { doubanId: 27140040,
        title: '超能力女儿',
        rate: 8.3,
        poster: 'https://img1.doubanio.com/view/photo/l_ratio_poster/public/p2505407577.jpg' },
      { doubanId: 26969029,
        title: '飞虎之潜行极战',
        rate: 7,
        poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2517581152.jpg' },
      { doubanId: 26787091,
        title: '海上嫁女记',
        rate: 6.6,
        poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2518640792.jpg' },
      { doubanId: 27157760,
        title: 'MEGALO BOX',
        rate: 9.5,
        poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2516380322.jpg' },
      { doubanId: 27108740,
        title: '家族之苦3',
        rate: 8.6,
        poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2515706733.jpg' },
      { doubanId: 27160614,
        title: '多田君不恋爱',
        rate: 7.6,
        poster: 'https://img1.doubanio.com/view/photo/l_ratio_poster/public/p2515059667.jpg' },
      { doubanId: 30161256,
        title: '爱情重跑',
        rate: 7.8,
        poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2518671313.jpg' } ];

    movies.map(async movie => {
        let movieData = await fetchMovie(movie);

        try {
            movieData = JSON.parse(movieData);
            console.log(movieData.tags);
            console.log(movieData.summary);
        } 
        catch (err) {
            console.log(err);
        }
    });
})();