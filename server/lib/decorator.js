const Router = require('koa-router');
const { resolve } = require('path');
const _ = require('lodash');
const glob = require('glob');

// 生成唯一前缀
const symbolPrefix = Symbol('prefix');
// router map；路径集合，统一管理
const routerMap = new Map();
//
const isArray = c => _.isArray(c) ? c : [c];

export class Route {
    /**
     * 构造函数
     * @param {object} app koa实例
     * @param {string} apiPath 路由所在的目录
     */
    constructor (app, apiPath) {
        this.app = app;
        this.apiPath = apiPath;
        this.router = new Router(); // 将路由实例交到自身属性
    }

    /**
     * 初始化
     */
    init () {
        // 加载每个路由文件，同时初始化每个路由控制器
        glob.sync(resolve(this.apiPath, './**/*.js')).forEach(require);

        for (let [conf, controller] of routerMap) {
            const controllers = isArray(controller);
            const prefixPath = conf.target[symbolPrefix];

            if (prefixPath) prefixPath = normalizePath(prefixPath);

            const routerPath = prefixPath + conf.path;

            // 实现 router.get('/', (ctx, next) => {});
            this.router[conf.method](routerPath, ...controllers);

            // 应用所有的路由规则
            this.app.use(this.router.routes());
            // 允许所有请求的方法
            this.app.use(this.router.allowedMethods()); 
        }
    }
}

// 规范化路径
const normalizePath = path => path.startsWith('/') ? path : `/${path}`;

/**
 * 处理路由
 * @param {object} conf 路径和请求方式
 */
const router = conf => (target, key, descriptor) => {
    // 统一过滤 path
    conf.path = normalizePath(conf.path);
    // 构建路由集合
    routerMap.set({
        target: target,
        ...conf
      }, target[key])
};

/**
 * 定义路由控制器 前缀
 * @param {String} path 路由控制器 前缀
 */
export const controller = path => target => (target.prototype[symbolPrefix] = path);

/*************************** 
* * 控制器下，各种请求方法
**************************/

/**
 * * path 前缀后面，具体访问路径
 * * router 装饰器
 */
export const get = path => router({
    method: 'get',
    path: path
});

export const post = path => router({
    method: 'post',
    path: path
});

export const put = path => router({
    method: 'put',
    path: path
});

export const del = path => router({
    method: 'del',
    path: path
});

// router use 方法
export const use = path => router({
    method: 'use',
    path: path
});

// router all 方法
export const all = path => router({
    method: 'all',
    path: path
});

