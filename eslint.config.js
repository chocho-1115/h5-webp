const js = require('@eslint/js');

module.exports = {
    extends: ["eslint:recommended"],
    env: {
        es6: true, // 启用es6中全局变量
        node: false, // 启用node中全局变量
        browser: true, // 启用浏览器中全局变量
    },
    parserOptions: {
    ecmaVersion: 6, // ECMAScript 版本号
    sourceType: "module",
    },
    rules: {
        "no-var": 2, // 不能使用 var 定义变量
    },
    globals: {
        "weui": "readonly",
        "wx": "readonly",
        "jssdk": "readonly",
        "TweenMax": "readonly",
        "gsap": "readonly",
        "Hammer": "readonly",
    }
}

