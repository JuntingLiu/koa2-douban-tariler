# koa2-douban-tariler
豆瓣电影预览


## 开发过程

1. static-index-html
2. template-engines
3. template-engines-middleware
4. tpl-static-page-dplayer
5. crawler-douban-movie-puppeteer
6. add-child-process-task-run-crawler-script
7. douban-api-v2-import
8. crawler-cover-trailer-video
9. crawler-data-upload-to-qiniu
## 网站服务

对于一个网站的服务，可用性、稳定性，提供的服务要稳定； Node.js 天生单线程，如果我们只在一个线程里跑很重的服务，很容易挂了；比如启一个内置浏览器，跑脚本，就很容易挂了，所以我们会在一个网站的主进程里跑起若干个子进程，来干脏活累活；子进程挂了，主进程还健在。

