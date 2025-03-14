import ESLintPlugin from 'eslint-webpack-plugin'

import projectConfig from './project.js'

export default {
    devServer: {
        headers: {},
        static: projectConfig.src,
        client: {
            logging: 'error',
            overlay: false // 关闭错误提示层
        },
        compress: true, // 是否启动压缩 gzip
        open: false, // 是否自动打开浏览器
        hot: true, // 热更新
        historyApiFallback: true
    },
    // devtool: 'inline-source-map',
    devtool: 'eval-cheap-module-source-map', // 定位到错误所在行信息，不需要定位列信息，速度较快
    module: {
        rules: [
            
        ]
    },
    plugins: [
        new ESLintPlugin({
            fix: true, // 自动修复
            // context: projectConfig.src, // 上下文目录 默认为编译器目录  compiler.context
            // overrideConfigFile: './eslint.config.mjs', // 配置文件 不配置此项 ESLintPlugin也会自动找到配置文件； 这里必须使用mjs，因为webpack默认commonjs模块系统
            configType: 'flat', // 使用最新的flat config方式 默认为eslintrc；flat使用esmodule模块系统  eslintrc使用commonjs模块系统
        })
    ],
    
}
