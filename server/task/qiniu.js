const qiniu = require('qiniu');
const nanoid = require('nanoid');
const config = require('../config');

// 七牛上传配置
const bucket = config.qiniu.bucket
const mac = new qiniu.auth.digest.Mac(config.qiniu.AK, config.qiniu.SK)
const cfg = new qiniu.conf.Config()
const client = new qiniu.rs.BucketManager(mac, cfg)

// 上传流程处理
const uploadToQiniu = async (url, key) => {
    return new Promise((resolve, reject) => {
        client.fetch(url, bucket, key, (err, ret, info) => {
            if (err) {
                reject(err);
            } 
            else {
                if (info.statusCode === 200) {
                    resolve({ key });
                } else {
                    reject(info);
                }
            }
        })
    });
};

;(async () => {
    const movies = [{
        doubanId: '26670671',
        poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2515605702.jpg',
        cover: 'https://img3.doubanio.com/img/trailer/medium/2518499201.jpg?1523033874',
        video: 'http://vt1.doubanio.com/201804142111/7782486cd71f94b800d0b66abbb3baae/view/movie/M/402290523.mp4' 
    }];

    movies.map(async movie => {
        if (movie.video && !movie.key) {
            try {
                console.log('开始传 poster～');
                let posterData = await uploadToQiniu(movie.poster, nanoid() + '.jpg');
                console.log('开始传 cover～');
                let coverData = await uploadToQiniu(movie.cover, nanoid() + '.jpg');
                console.log('开始传 video～');
                let videoData = await uploadToQiniu(movie.video, nanoid() + '.mp4');

                if (posterData.key) {
                    movie.posterKey = posterData.key;
                }
                if (coverData.key) {
                    movie.coverKey = coverData.key;
                }
                if (videoData.key) {
                    movie.videoKey = videoData.key;
                }

                console.log(movie);

            } catch (err) {
                console.log(err);
            }
        }
    });
})();

// { 
//   doubanId: '26670671',
//   poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2515605702.jpg',
//   cover: 'https://img3.doubanio.com/img/trailer/medium/2518499201.jpg?1523033874',
//   video: 'http://vt1.doubanio.com/201804142111/7782486cd71f94b800d0b66abbb3baae/view/movie/M/402290523.mp4',
//   posterKey: 'http://p76g3gz8z.bkt.clouddn.com/GNeSF6UWM3zh~UNYBeUav.jpg',
//   coverKey: 'http://p76g3gz8z.bkt.clouddn.com/nXRMNZThB7iCH4hhyeAs7.jpg',
//   videoKey: 'http://p76g3gz8z.bkt.clouddn.com/P4qqm0Oq3riytKkoVE3za.mp4' 
// }