import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

import projectConfig from './project.js'

const __dirname = path.resolve()

export default {
    mode: process.env.MODE,
    performance: false, // 不显示大文件警告
    stats: 'errors-only', // 只输出错误信息
    entry: {
        main: projectConfig.src + 'main.js',
    },
    output: {
        filename: 'js/[name]-[chunkhash].js',
        path: path.resolve(__dirname, projectConfig.dist)
    },
    cache: false,
    // {
    //     type: 'filesystem', // 使用文件缓存。通过 cache: filesystem 可以将构建过程的 webpack 模板进行缓存，大幅提升二次构建速度、打包速度，当构建突然中断，二次进行构建时，可以直接从缓存中拉取，可提速 80% 左右。
    //     maxAge: 4 * 60 * 60 * 1000 // 允许未使用的缓存留在文件系统缓存中，保留4小时
    // },
    resolve: {
        // extensions: ['js', '.css', '...'], // 注意：1.高频文件后缀名放前面 2.手动配置后，默认配置会被覆盖，如果想保留默认配置，可以用 ... 扩展运算符代表默认配置
        alias: {
            '@': path.resolve(projectConfig.src)
        },
        symlinks: false // 减少解析工作量
    },
    module: {
        rules: [
            {
                test: /.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                resolve: {
                    fullySpecified: false
                },
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.(s[ac]|c)ss$/i, // 匹配所有的 sass/scss/css 文件, // 匹配所有的 css 文件
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            esModule: true
                        },
                    },
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 0 // 4 * 1024 // 小于 ？kb 转 base64 默认值为 4 * 1024
                    }
                },
                generator: {
                    filename: 'image/[name][ext]' // 导出图片路径 在打包时才需配置
                },
                
            }
        ]
    },
    plugins: [
        // https://webpack.js.org/plugins/html-webpack-plugin/
        new HtmlWebpackPlugin({
            template: projectConfig.src + 'index.html',
            filename: 'index.html',
            inject: 'body'
        }),
        // 提取js中的css 生成独立的css文件
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            // filename: '[name].css',
            filename: 'css/[name]-[contenthash].css', // 'css/main.css',
            // chunkFilename: 'css/main.css',
        })

    ],
    externals: {
        // jquery: 'jQuery'
    }
}
