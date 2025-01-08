import {merge} from 'webpack-merge'
import baseConfig from './config/webpack.base.js'
import devConfig from './config/webpack.dev.js'
import proConfig from './config/webpack.pro.js'

// eslint-disable-next-line no-unused-vars
export default function (env, argv) {
    let config = {}
    if(process.env.MODE == 'development') config = merge(baseConfig,  devConfig)
    if(process.env.MODE == 'production') config = merge(baseConfig,  proConfig)
    return config
}

// 文档定义loader为在模块加载时的预处理文件，故loader运行在打包文件之前。
// plugins的定义为处理loader无法处理的事物，例如loader只能在打包之前运行，但是plugins在整个编译周期都起作用。

// plugin顺序没有限制，因为每个plugin内部实现都是用钩子处理，即回调函数。
// loader是有顺序的，webpack肯定是先将所有css模块依赖解析完得到计算结果再创建style标签。因此应该把style-loader放在css-loader的前面（webpack loader的执行顺序是从右到左）