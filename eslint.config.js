module.exports = {
    extends: ["eslint:recommended"],
    env: {
        es6: true, // 启用es6中全局变量
        node: true, // 启用node中全局变量
        browser: true, // 启用浏览器中全局变量
    },
    // languageOptions: {
        
    // },
    parserOptions: {
        ecmaVersion: 6, // ECMAScript 版本号
        sourceType: "module",
    },
    globals: {
        "weui": "readonly",
        "wx": "readonly",
        "jssdk": "readonly",
        "TweenMax": "readonly",
        "gsap": "readonly",
        "Hammer": "readonly",
    },

    rules: {
        "no-var": 2, // 不能使用 var 定义变量
        "indent": ["error", 4], // 缩进
    },
    ignorePatterns: ["libs/"], // 忽略
    
}

