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




// // https://juejin.cn/post/7451819556030922787

// 要使用 @babel/plugin-transform-runtime 插件，其实只有一个 npm 包是必须要装的，那就是它自己 @babel/plugin-transform-runtime。
// 对于 @babel/runtime 及其进化版 @babel/runtime-corejs2、@babel/runtime-corejs3，我们只需要根据自己的需要安装一个。
// 在安装 @babel/preset-env 的时候，其实已经自动安装了@babel/runtime，不过在项目开发的时候，我们一般都会再单独安装一遍@babel/runtime。
// 如果你不需要对 core-js 做 API 转换，那就安装 @babel/runtime 并把 corejs 配置项设置为 false 即可。
// 如果你需要用 core-js2 做 API 转换，那就安装 @babel/runtime-corejs2 并把 corejs 配置项设置为 2 即可。
// 如果你需要用 core-js3 做 API 转换，那就安装 @babel/runtime-corejs3 并把 corejs 配置项设置为 3 即可。
