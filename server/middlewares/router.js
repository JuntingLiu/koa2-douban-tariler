const { Route } = require("../lib/decorator");
const { resolve } = require("path");

export const router = app => {
    const apiPath = resolve(__dirname, '../routes'); // 路由所在目录
    const router = new Route(app, apiPath);

    router.init();
}