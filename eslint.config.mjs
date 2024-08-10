import js from "@eslint/js";
import globals from "globals";

export default [
    js.configs.recommended, // 推荐规则配置

    {
        languageOptions: {
            ecmaVersion: "latest", // 最新es语法
            sourceType: "module", // module 和 script
            globals: {
                ...globals.browser,
                // ...globals.node,
                "weui": "readonly",
                "wx": "readonly",
                "jssdk": "readonly",
                "TweenMax": "readonly",
                "gsap": "readonly",
                "Hammer": "readonly",
            }, // 全局变量
        },
        rules: {
            "no-var": 1, // 不能使用 var 定义变量
            "indent": ["error", 4], // 缩进
        }
    },
    
    // 全局ignores 不能添加其他键 
    // 只有全局ignores模式才能匹配目录
    // In your eslint.config.js file, if an ignores key is used without any other keys in the configuration object, then the patterns act as global ignores.
    {
        ignores: ["node_modules/", "dist/", "**/libs/", "**/media/", "**/css/", "**/image/", "**/static/"], // 全局ignores是相对于配置文件的
    }

];