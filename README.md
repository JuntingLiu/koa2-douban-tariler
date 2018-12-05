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
10. event-code-example
11. event-code-example-readme
12. add-mongoose
13. create-movie-schema
14. create-user-schema
15. create-category-schema-and-generator-collections
16. generator-collections-movie-category
17. import-koa-router-movies-list-detail
18. koa-router-restful-api
 ## 网站服务

对于一个网站的服务，可用性、稳定性，提供的服务要稳定； Node.js 天生单线程，如果我们只在一个线程里跑很重的服务，很容易挂了；比如启一个内置浏览器，跑脚本，就很容易挂了，所以我们会在一个网站的主进程里跑起若干个子进程，来干脏活累活；子进程挂了，主进程还健在。

## MongoDB 安装

[官方文档](https://docs.mongodb.com)
### CentOS 

**查看centos 版本信息**

这个需要安装了 redhat-lsb (yum install -y readhat-lsb)
```
$ lsb_release -a
```
**其他查看版本号的方式**
CentOS的版本号信息一般存放在配置文件当中，在CentOS中，与其版本相关的配置文件中都有centos关键字，该文件一般存放在/etc/目录下，所以说我们可以直接在该文件夹下搜索相关的文件。

```
[root@VM_0_2_centos ~]# ll /etc/**centos**
-rw-r--r-- 1 root root 38 8月  30 2017 /etc/centos-release
-rw-r--r-- 1 root root 51 8月  30 2017 /etc/centos-release-upstream
[root@VM_0_2_centos ~]# cat /etc/centos-release
CentOS Linux release 7.4.1708 (Core)
```

**配置MongoDB安装源**

按以下路径创建一个 `/etc/yum.repos.d/mongodb-org-3.6.repo `文件，以便可以使用yum直接安装MongoDB。

```
$ vim /etc/yum.repos.d/mongodb-org-3.4.repo
```
使用以下配置存储文件：

```
[mongodb-org-3.4]
name=MongoDB 3.4 Repository
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/3.4/x86_64/
gpgcheck=0
enabled=1

# 最新版本是 `3.6` ，比`3.4`版本多了一个 `gpgkey` 验证
```
这里还需要更改下`mongodb`的下载源，更换国内阿里源

```
baseurl=http://mirrors.aliyun.com/mongodb/yum/redhat/7/mongodb-org/3.4/x86_64/
```

**安装MongoDB软件包**

```
$ sudo yum install -y mongodb-org
```

**启动MongoDB**

```
# 启动
$ sudo service mongod start
# 停止
$ sudo service mongod stop
# 重启
$ sudo service mongod restart

# 确认MongoDB是否已成功启动 通过验查mongodb的日志
$ cat /var/log/mongodb/mongod.log
# 确保MongoDB在启动系统后启动：
$ sudo chkconfig mongod on
```
**连接MongoDb**

```
$ mongo --host 127.0.0.1:27017
```

**卸载 MongoDB**

```
# 停止MongoDB 服务
$ sudo service mongod stop
# 删除包
$ sudo yum erase $(rpm -qa | grep mongodb-org)
# 删除MongoDB数据库和日志文件
$ sudo rm -r /var/log/mongodb
$ sudo rm -r /var/lib/mongo
```

### macOS

macOS 就很简单了，使用`HomeBrew`进行安装就好

**安装HomeBrew**

[官方文档](https://brew.sh/)

```
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

**安装MongoDB**

```
# 更新brew
$ brew update
# 安装
$ brew install mongodb
# 安装最新版本（测试、开发）
$ brew install mongodb --devel
# 查看mongodb 相关信息
$ brew info mongodb
# 启动
$ brew service mongod start
# 运行 mongodb
$ mongod --dbpath <path to data directory 指定数据目录路径>
```

## MongoDB 概念

三个概念，需要分清；从字面意思跟关系型数据库的库表有所不同，但本质上海市一样的，数据结构不一样
### document 文档

相当于关系数据库的一条记录

### collection 集合

多条记录、多个文档，相当于关系型数据库的表
### database

多个集合，在逻辑上有所联系，相当于关系型数据库的数据库了
## Mongoose 概念

也有三个概念，在MongoDB驱动的基础上，继续抽象、封装的对象模型工具；能让我们在代码层面和数据层面更容易使用、门槛比较低。

### schema

看作Mongose 里面的一种 数据模式、数据定义，表的结构、表的字段（字段类型、字段长度； 对表具体的定义； 对应 MongoDB 的 某个collection； 存定义不具备操作数据的能力
### model

数据库的相关操作，他是由 schema 发布生成对应的模型，具有一些抽象属性、行为一个数据库的操作对，具有操作某张表操作能力的函数集合，函数集合的操作对象就是整个collection（整张表），可以进行 CRUD 相关操作
###  entity

entity 就是 model 所创建的数据实体，他的操作也会影响到数据库；简单来讲就是某条数据，这条数据的自身不是干巴巴的数据，还集成了一些方法，改变自身。

### 总结MongoDB 和 Mongoose

* MongoDB 的 document、collection、database 可以对应到 关系型数据库的 row（行数）、tabel（表）、db（数据库）
* Mongoose 是对 MongoDB 的抽象和封装，针对数据本身还扩展些能力的函数集合；schema、model、entity 对应到 数据定义、数据的操作模型、针对到某条拥有自我修改的数据

## 文件改动能够动态重新编译

**使用场景**

前后端没有分离，都在一个项目里；即提供API后台服务，又提供前端静态网页的能力和静态资源能力的时候；就可以在 `server` 里配置一个 `koa`中间件，以中间件去动态加载 `parcel-bundel`,根据当前运行时环境来区分，动态加载两种不同的配置文件。

将`parcel`集成进来，以中间件的形式;
