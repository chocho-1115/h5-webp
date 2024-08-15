import js from '@eslint/js'
import globals from 'globals'

// console.log(js.configs.recommended)

export default [
    js.configs.recommended, // 推荐规则配置

    {
        languageOptions: {
            ecmaVersion: 'latest', // 最新es语法
            sourceType: 'module', // module 和 script
            globals: {
                ...globals.browser,
                ...globals.node,
                'weui': 'readonly',
                'wx': 'readonly',
                'jWeixin': 'readonly',
                'jssdk': 'readonly',
                'TweenMax': 'readonly',
                'gsap': 'readonly',
                'Hammer': 'readonly',
            }, // 全局变量
        },
        rules: {
            'no-var': 1, // 不能使用 var 定义变量
            'spaced-comment': 1, // 注释风格要不要有空格
            'indent': [1, 4], // 缩进
            'semi': [1, 'never'], // 分号结尾
            'quotes': [1, 'single'], // 字符串单引号
            'key-spacing': [1, { 'beforeColon': false, 'afterColon': true }], // 对象字面量中冒号的前后空格
            // 'no-unused-vars': [1, { varsIgnorePattern: '.*', args: 'none' }],
        }
    },
    
    // 全局ignores 不能添加其他键 
    // 只有全局ignores模式才能匹配目录
    // In your eslint.config.js file, if an ignores key is used without any other keys in the configuration object, then the patterns act as global ignores.
    {
        ignores: ['node_modules/', 'dist/', '**/libs/', '**/media/', '**/css/', '**/image/', '**/static/'], // 全局ignores是相对于配置文件的
    }

]